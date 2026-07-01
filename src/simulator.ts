import { knowledgeById, type EffectMode, type KnowledgeNode } from './knowledge';

export type NodeRuntimeState = 'on' | 'off' | 'blocked';

export type ExperimentResult = {
  states: Record<string, NodeRuntimeState>;
  blockedBy: Record<string, string[]>;
  activeEffects: Array<{ node: KnowledgeNode; state: NodeRuntimeState }>;
  primaryMode: EffectMode | 'healthy';
  metrics: { latencyMs: number; originLoad: number; bandwidthMbps: number; errorRate: number };
};

const effectPriority: Array<EffectMode> = [
  'blank', 'dns-error', 'offline', 'server-error', 'gateway-error', 'not-found',
  'api-error', 'data-error', 'unstyled', 'inert', 'slow', 'degraded',
];

export function resolveExperiment(activeNodeIds: string[], disabledNodeIds: Iterable<string>): ExperimentResult {
  const active = new Set(activeNodeIds);
  const disabled = new Set(disabledNodeIds);
  const states: Record<string, NodeRuntimeState> = {};
  const blockedBy: Record<string, string[]> = {};
  const resolving = new Set<string>();

  const resolveNode = (id: string): NodeRuntimeState => {
    if (states[id]) return states[id];
    if (disabled.has(id)) return (states[id] = 'off');
    if (resolving.has(id)) return 'on';
    resolving.add(id);
    const node = knowledgeById[id];
    const unavailableDependencies = (node?.dependencies || [])
      .filter((dependencyId) => active.has(dependencyId))
      .filter((dependencyId) => resolveNode(dependencyId) !== 'on');
    resolving.delete(id);
    if (unavailableDependencies.length) {
      blockedBy[id] = unavailableDependencies;
      return (states[id] = 'blocked');
    }
    return (states[id] = 'on');
  };

  activeNodeIds.forEach(resolveNode);

  const activeEffects = activeNodeIds
    .filter((id) => states[id] !== 'on')
    .map((id) => ({ node: knowledgeById[id], state: states[id] }))
    .filter((item): item is { node: KnowledgeNode; state: NodeRuntimeState } => Boolean(item.node));

  const explicitEffects = activeEffects.filter((item) => item.state === 'off');
  const primaryMode = effectPriority.find((mode) => explicitEffects.some((item) => item.node.effect.mode === mode))
    || effectPriority.find((mode) => activeEffects.some((item) => item.node.effect.mode === mode))
    || 'healthy';
  const metrics = calculateMetrics(disabled, states);
  return { states, blockedBy, activeEffects, primaryMode, metrics };
}

function calculateMetrics(disabled: Set<string>, states: Record<string, NodeRuntimeState>) {
  let latencyMs = 90;
  let originLoad = 24;
  let bandwidthMbps = 80;
  let errorRate = 0.2;

  if (disabled.has('latency')) latencyMs += 420;
  if (disabled.has('bandwidth')) { latencyMs += 900; bandwidthMbps = 1.5; }
  if (disabled.has('cdn')) { latencyMs += 230; originLoad += 38; }
  if (disabled.has('cache')) { latencyMs += 310; originLoad += 34; }
  if (disabled.has('index')) latencyMs += 650;
  if (disabled.has('load-balancer')) { originLoad += 42; errorRate += 3.8; }
  if (disabled.has('autoscaling')) { originLoad += 31; errorRate += 2.1; }
  if (disabled.has('message-queue')) latencyMs += 280;

  const hardFailure = Object.entries(states).some(([id, state]) => {
    if (state === 'on') return false;
    const mode = knowledgeById[id]?.effect.mode;
    return ['blank', 'dns-error', 'offline', 'server-error', 'gateway-error'].includes(mode);
  });
  if (hardFailure) errorRate = Math.max(errorRate, 100);
  else if (Object.values(states).some((state) => state !== 'on')) errorRate += 7.5;

  return {
    latencyMs: Math.round(latencyMs),
    originLoad: Math.min(100, Math.round(originLoad)),
    bandwidthMbps,
    errorRate: Math.min(100, Math.round(errorRate * 10) / 10),
  };
}

export function toggleDisabled(disabled: Set<string>, id: string) {
  const next = new Set(disabled);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}
