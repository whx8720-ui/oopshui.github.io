import { describe, expect, it } from 'vitest';
import { codeExamples } from './codeExamples';
import { knowledgeById, knowledgeNodes, stageNodeIds } from './knowledge';
import { resolveExperiment, toggleDisabled } from './simulator';

describe('experiment dependency engine', () => {
  it('cascades CSS failure into layout concepts without removing HTML', () => {
    const result = resolveExperiment(stageNodeIds[2], ['css']);
    expect(result.states.html).toBe('on');
    expect(result.states.css).toBe('off');
    expect(result.states['box-model']).toBe('blocked');
    expect(result.states.layout).toBe('blocked');
    expect(result.primaryMode).toBe('unstyled');
  });

  it('makes browser behavior inert when JavaScript is disabled', () => {
    const result = resolveExperiment(stageNodeIds[2], ['javascript']);
    expect(result.states.javascript).toBe('off');
    expect(result.states.dom).toBe('blocked');
    expect(result.states.events).toBe('blocked');
    expect(result.states.state).toBe('blocked');
    expect(result.primaryMode).toBe('inert');
  });

  it('distinguishes DNS, public network and server failures', () => {
    expect(resolveExperiment(stageNodeIds[3], ['dns']).primaryMode).toBe('dns-error');
    expect(resolveExperiment(stageNodeIds[3], ['public-network']).primaryMode).toBe('offline');
    expect(resolveExperiment(stageNodeIds[3], ['web-server']).primaryMode).toBe('server-error');
  });

  it('keeps the page shell while API or database data fails', () => {
    const api = resolveExperiment(stageNodeIds[4], ['api']);
    const database = resolveExperiment(stageNodeIds[4], ['database']);
    expect(api.primaryMode).toBe('api-error');
    expect(api.states.auth).toBe('blocked');
    expect(database.primaryMode).toBe('data-error');
    expect(database.states.crud).toBe('blocked');
  });

  it('models cache and CDN removal as degradation instead of outage', () => {
    const cache = resolveExperiment(stageNodeIds[5], ['cache']);
    const cdn = resolveExperiment(stageNodeIds[5], ['cdn']);
    expect(cache.primaryMode).toBe('slow');
    expect(cache.metrics.latencyMs).toBeGreaterThan(90);
    expect(cdn.metrics.originLoad).toBeGreaterThan(24);
    expect(cdn.metrics.errorRate).toBeLessThan(100);
  });

  it('supports deterministic free-form toggles and reset', () => {
    const once = toggleDisabled(new Set(), 'css');
    const twice = toggleDisabled(once, 'javascript');
    expect([...twice].sort()).toEqual(['css', 'javascript']);
    expect(toggleDisabled(twice, 'css').has('css')).toBe(false);
    expect(resolveExperiment(stageNodeIds[2], twice)).toEqual(resolveExperiment(stageNodeIds[2], twice));
  });
});

describe('knowledge content integrity', () => {
  it('has unique IDs, valid dependencies and complete effects', () => {
    const ids = knowledgeNodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of knowledgeNodes) {
      expect(node.summary).toBeTruthy();
      expect(node.why).toBeTruthy();
      expect(node.where).toBeTruthy();
      expect(node.effect.title).toBeTruthy();
      expect(node.effect.description).toBeTruthy();
      node.dependencies.forEach((dependency) => expect(knowledgeById[dependency]).toBeTruthy());
      if (node.codeRef) {
        const example = codeExamples[node.codeRef.stageId];
        expect(example).toBeTruthy();
        expect(example.sections.some((section) => section.id === node.codeRef?.sectionId)).toBe(true);
      }
    }
  });

  it('uses only valid knowledge nodes in every stage preset', () => {
    Object.values(stageNodeIds).flat().forEach((id) => expect(knowledgeById[id]).toBeTruthy());
  });
});
