import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Box, Check, ChevronRight, CircleHelp,
  Cloud, Code2, Database, ExternalLink, FileCode2, Gauge, Globe2, Layers3, Map,
  Menu, Monitor, MousePointer2, Network, PanelLeft, Play, RotateCcw, Search,
  Server, ShieldCheck, Sparkles, X, Zap,
} from 'lucide-react';
import { stages, type Stage } from './data';
import { codeExamples } from './codeExamples';
import {
  categoryMeta, knowledgeById, knowledgeNodes, stageNodeIds,
  type KnowledgeCategory, type KnowledgeNode,
} from './knowledge';
import { resolveExperiment, toggleDisabled, type ExperimentResult, type NodeRuntimeState } from './simulator';

type Panel = 'principle' | 'flow' | 'code' | 'result';
type DemoMode = 'preview' | 'code';
type NavigationMode = 'timeline' | 'map';

const stageIcons = [Globe2, MousePointer2, Network, Database, Gauge, Cloud, Sparkles];
const categoryIcons: Record<KnowledgeCategory, typeof Globe2> = {
  frontend: Monitor, network: Network, backend: Server, data: Database, infrastructure: Cloud,
};
const experimentNodeIds: Record<number, string[]> = {
  1: ['html', 'css', 'layout'],
  2: ['css', 'javascript', 'events', 'state'],
  3: ['dns', 'public-network', 'web-server', 'bandwidth'],
  4: ['route', 'api', 'database', 'cookie-session'],
  5: ['cdn', 'cache', 'index', 'bandwidth'],
  6: ['api-gateway', 'load-balancer', 'monitoring', 'autoscaling'],
  7: ['public-network', 'api-gateway', 'database', 'monitoring'],
};

function readStageFromHash() {
  const value = Number(window.location.hash.replace('#stage-', ''));
  return value >= 1 && value <= stages.length ? value : 1;
}

function App() {
  const [activeId, setActiveId] = useState(readStageFromHash);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('timeline');
  const [panel, setPanel] = useState<Panel>('principle');
  const [demoMode, setDemoMode] = useState<DemoMode>('preview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [disabledNodes, setDisabledNodes] = useState<Set<string>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState(experimentNodeIds[readStageFromHash()][0]);
  const [codeSection, setCodeSection] = useState(codeExamples[readStageFromHash()].sections[0].id);

  const active = stages[activeId - 1];
  const activeNodeIds = stageNodeIds[activeId];
  const activeNodes = activeNodeIds.map((id) => knowledgeById[id]).filter(Boolean);
  const experiment = useMemo(() => resolveExperiment(activeNodeIds, disabledNodes), [activeNodeIds, disabledNodes]);
  const selectedNode = knowledgeById[selectedNodeId] || activeNodes[0];

  const selectNode = (id: string, openPrinciple = true) => {
    const node = knowledgeById[id];
    if (!node) return;
    setSelectedNodeId(id);
    if (openPrinciple) setPanel('principle');
    if (node.codeRef?.stageId === activeId) setCodeSection(node.codeRef.sectionId);
  };

  const goToStage = (id: number) => {
    const next = Math.max(1, Math.min(stages.length, id));
    setActiveId(next);
    setNavigationMode('timeline');
    setPanel('principle');
    setDemoMode('preview');
    setDisabledNodes(new Set());
    setSelectedNodeId(experimentNodeIds[next][0]);
    setCodeSection(codeExamples[next].sections[0].id);
    setMenuOpen(false);
    window.history.replaceState(null, '', `#stage-${next}`);
  };

  const toggleNode = (id: string) => {
    setDisabledNodes((current) => toggleDisabled(current, id));
    selectNode(id);
    setPanel('result');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && navigationMode === 'timeline') goToStage(activeId - 1);
      if (event.key === 'ArrowRight' && navigationMode === 'timeline') goToStage(activeId + 1);
      if (event.key === 'Escape') { setGlossaryOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId, navigationMode]);

  return (
    <div className="app-shell" style={{ '--accent': active.accent } as CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => goToStage(1)}>
          <span className="brand-mark"><Network size={19} /></span>
          <span><strong>Web, from zero</strong><small>可拆解的网站实验室</small></span>
        </button>
        <nav className="top-actions" aria-label="辅助导航">
          <button className="text-button" onClick={() => setGlossaryOpen(true)}><BookOpen size={16} /> 术语手册</button>
          <a className="text-button desktop-only" href="https://github.com/whx8720-ui/oopshui.github.io" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="打开目录"><Menu size={20} /></button>
        </nav>
      </header>
      <div className="progress-line"><span style={{ width: navigationMode === 'map' ? '100%' : `${(activeId / stages.length) * 100}%` }} /></div>

      <aside className={`chapter-drawer ${menuOpen ? 'is-open' : ''}`}>
        <div className="drawer-heading"><div><small>LEARNING LAB</small><strong>网站知识实验室</strong></div><button className="icon-button mobile-menu" onClick={() => setMenuOpen(false)}><X size={19} /></button></div>
        <div className="nav-mode-switch">
          <button className={navigationMode === 'timeline' ? 'is-active' : ''} onClick={() => setNavigationMode('timeline')}><PanelLeft size={14} />演进时间线</button>
          <button className={navigationMode === 'map' ? 'is-active' : ''} onClick={() => { setNavigationMode('map'); setMenuOpen(false); }}><Map size={14} />知识地图</button>
        </div>
        {navigationMode === 'timeline' ? (
          <div className="chapter-list">
            {stages.map((stage, index) => {
              const Icon = stageIcons[index];
              return <button key={stage.id} className={`chapter-item ${activeId === stage.id ? 'is-active' : ''}`} onClick={() => goToStage(stage.id)}>
                <span className="chapter-icon"><Icon size={17} /></span>
                <span className="chapter-copy"><small>{stage.era}</small><strong>{stage.title}</strong></span>
                <span className="chapter-number">0{stage.id}</span>
              </button>;
            })}
          </div>
        ) : (
          <div className="category-list">
            {(Object.keys(categoryMeta) as KnowledgeCategory[]).map((category) => {
              const Icon = categoryIcons[category];
              const count = knowledgeNodes.filter((node) => node.category === category).length;
              return <a key={category} href={`#map-${category}`}><Icon size={16} /><span><strong>{categoryMeta[category].label}</strong><small>{count} 个知识点</small></span></a>;
            })}
          </div>
        )}
        <div className="drawer-note"><CircleHelp size={17} /><span>关闭组件，观察一条网站链路怎样退化或失败。所有状态都是可重复的前端模拟。</span></div>
      </aside>
      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="关闭目录" />}

      <main className="main-stage">
        {navigationMode === 'map' ? (
          <KnowledgeMap selectedId={selectedNodeId} onSelect={selectNode} onEnterStage={goToStage} />
        ) : (
          <>
            <section className="hero-copy">
              <div className="eyebrow"><span>STAGE 0{active.id}</span><i />{active.era}</div>
              <h1>{active.title}</h1><h2>{active.subtitle}</h2><p>{active.summary}</p>
              <div className="hero-meta"><span>{active.year}</span><i /><span>{active.productExample}</span></div>
            </section>

            <section className="learning-workbench">
              <div className="demo-column">
                <div className="section-label"><span>01</span> 拆掉一个组件，看看会怎样</div>
                <BrowserLab
                  stage={active} result={experiment} disabled={disabledNodes} selectedNode={selectedNode}
                  demoMode={demoMode} codeSection={codeSection}
                  onModeChange={setDemoMode} onSectionChange={setCodeSection}
                  onSelectNode={selectNode} onToggleNode={toggleNode} onReset={() => setDisabledNodes(new Set())}
                />
              </div>
              <div className="explain-column">
                <div className="section-label"><span>02</span> 理解它在系统里的位置</div>
                <LearningPanel
                  stage={active} panel={panel} onPanelChange={setPanel} node={selectedNode}
                  result={experiment} disabled={disabledNodes} codeSection={codeSection}
                  onInspectCode={(section) => { setCodeSection(section); setDemoMode('code'); setPanel('code'); }}
                  onToggleNode={toggleNode}
                />
              </div>
            </section>
            <footer className="stage-footer">
              <button onClick={() => goToStage(activeId - 1)} disabled={activeId === 1}><ArrowLeft size={17} /> 上一阶段</button>
              <div><span>{String(activeId).padStart(2, '0')}</span><i /><span>{String(stages.length).padStart(2, '0')}</span></div>
              <button onClick={() => goToStage(activeId + 1)} disabled={activeId === stages.length}>下一阶段 <ArrowRight size={17} /></button>
            </footer>
          </>
        )}
      </main>
      {glossaryOpen && <Glossary onClose={() => setGlossaryOpen(false)} />}
    </div>
  );
}

function BrowserLab({ stage, result, disabled, selectedNode, demoMode, codeSection, onModeChange, onSectionChange, onSelectNode, onToggleNode, onReset }: {
  stage: Stage; result: ExperimentResult; disabled: Set<string>; selectedNode: KnowledgeNode;
  demoMode: DemoMode; codeSection: string; onModeChange: (mode: DemoMode) => void;
  onSectionChange: (section: string) => void; onSelectNode: (id: string) => void;
  onToggleNode: (id: string) => void; onReset: () => void;
}) {
  const [demoState, setDemoState] = useState(0);
  useEffect(() => setDemoState(0), [stage.id]);
  const hotspotNodes = stageNodeIds[stage.id].map((id) => knowledgeById[id]).filter((node) => node?.hotspots?.[stage.id]);
  const controls = experimentNodeIds[stage.id].map((id) => knowledgeById[id]);

  return <div className="lab-card">
    <div className="browser-chrome"><div className="traffic-lights"><i /><i /><i /></div><div className="address-bar"><ShieldCheck size={12} /> https://product.example.com/stage-{stage.id}</div><span>•••</span></div>
    <div className="view-switcher"><span>查看方式</span><div>
      <button className={demoMode === 'preview' ? 'is-active' : ''} onClick={() => onModeChange('preview')}><Monitor size={13} />交互实验</button>
      <button className={demoMode === 'code' ? 'is-active' : ''} onClick={() => onModeChange('code')}><FileCode2 size={13} />对应代码</button>
    </div></div>
    {demoMode === 'preview' ? <div className="simulator-viewport">
      <SimulatedSite stage={stage} state={demoState} result={result} onAction={() => result.states.javascript === 'off' || result.states.events === 'off' ? undefined : setDemoState((value) => (value + 1) % 3)} />
      {result.primaryMode !== 'blank' && hotspotNodes.map((node, index) => {
        const position = node.hotspots![stage.id];
        const state = result.states[node.id] || 'on';
        return <button key={node.id} className={`knowledge-hotspot is-${state} ${selectedNode.id === node.id ? 'is-selected' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} onClick={() => onSelectNode(node.id)} aria-label={`${node.title}：${node.summary}`}>
          <span>{index + 1}</span><i><strong>{node.title}</strong>{node.summary}</i>
        </button>;
      })}
      <div className="metric-strip">
        <Metric label="延迟" value={`${result.metrics.latencyMs} ms`} alert={result.metrics.latencyMs > 400} />
        <Metric label="源站负载" value={`${result.metrics.originLoad}%`} alert={result.metrics.originLoad > 70} />
        <Metric label="带宽" value={`${result.metrics.bandwidthMbps} Mbps`} alert={result.metrics.bandwidthMbps < 5} />
        <Metric label="错误率" value={`${result.metrics.errorRate}%`} alert={result.metrics.errorRate > 5} />
      </div>
    </div> : <CodeViewer stage={stage} activeSection={codeSection} onSectionChange={onSectionChange} />}
    <div className="experiment-switchboard">
      <div><span>组件开关</span><small>支持自由组合</small></div>
      <div className="switch-list">{controls.map((node) => {
        const state = result.states[node.id] || 'on';
        return <button key={node.id} className={`switch-chip is-${state}`} onClick={() => onToggleNode(node.id)} title={node.effect.description}><i /><span>{node.title}<small>{state === 'blocked' ? '被依赖阻断' : state === 'off' ? '已关闭' : '运行中'}</small></span></button>;
      })}</div>
      <button className="reset-button" onClick={onReset} disabled={!disabled.size}><RotateCcw size={14} />重置</button>
    </div>
  </div>;
}

function Metric({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return <span className={alert ? 'is-alert' : ''}><small>{label}</small><strong>{value}</strong></span>;
}

function SimulatedSite({ stage, state, result, onAction }: { stage: Stage; state: number; result: ExperimentResult; onAction: () => void }) {
  if (result.primaryMode === 'blank') return <FailureScreen icon={<Code2 />} title="没有 HTML，浏览器没有正文可以渲染" detail="浏览器窗口和地址栏属于浏览器，不属于网页。" />;
  if (result.primaryMode === 'dns-error') return <FailureScreen icon={<Globe2 />} title="找不到 product.example.com 的服务器 IP" detail="DNS 解析在连接服务器之前失败。" code="DNS_PROBE_FINISHED_NXDOMAIN" />;
  if (result.primaryMode === 'offline') return <FailureScreen icon={<Network />} title="无法连接网络" detail="局域网或公网链路中断，请求没有抵达服务器。" code="ERR_NETWORK_UNREACHABLE" />;
  if (result.primaryMode === 'server-error') return <FailureScreen icon={<Server />} title="服务器暂时无法响应" detail="地址和网络正常，但提供网页的服务没有运行。" code="503 SERVICE UNAVAILABLE" />;
  if (result.primaryMode === 'gateway-error') return <FailureScreen icon={<Network />} title="网关无法分发 API 请求" detail="静态入口仍在，内部用户、内容和推荐服务不可达。" code="502 BAD GATEWAY" />;
  if (result.primaryMode === 'not-found') return <FailureScreen icon={<Search />} title="服务器找不到这个路径" detail="服务器在线，但没有路由负责当前 URL。" code="404 NOT FOUND" />;
  if (result.primaryMode === 'unstyled') return <div className="unstyled-page"><header>O/ 产品主页　首页　文档　关于</header><main><p>WELCOME TO THE WEB</p><h1>{stage.title}</h1><h2>{stage.subtitle}</h2><p>{stage.summary}</p><button onClick={onAction}>打开页面</button></main><footer>© Web, from zero</footer></div>;

  const slow = result.primaryMode === 'slow';
  const inert = result.primaryMode === 'inert';
  const apiError = result.activeEffects.some((item) => ['api-error', 'data-error'].includes(item.node.effect.mode));
  const noLayout = result.states.layout === 'off' || result.states.layout === 'blocked';
  return <div className={`site-scene stage-scene-${stage.id} ${slow ? 'is-slow' : ''} ${inert ? 'is-inert' : ''} ${noLayout ? 'is-no-layout' : ''}`}>
    <div className="demo-site-header"><span className="demo-logo">O/</span><nav><i /><i /><i /></nav></div>
    <StageScene stage={stage} state={state} apiError={apiError} />
    <button className="demo-action" onClick={onAction} disabled={inert}><Play size={13} fill="currentColor" />{inert ? 'JavaScript 已关闭' : '操作一下'}</button>
    {slow && <div className="loading-warning"><Activity size={13} />资源正在缓慢加载…</div>}
  </div>;
}

function FailureScreen({ icon, title, detail, code }: { icon: ReactNode; title: string; detail: string; code?: string }) {
  return <div className="failure-screen"><span>{icon}</span><h3>{title}</h3><p>{detail}</p>{code && <code>{code}</code>}</div>;
}

function StageScene({ stage, state, apiError }: { stage: Stage; state: number; apiError: boolean }) {
  if (stage.id === 1) return <div className="landing-scene"><small>HTML + CSS</small><h3>你的产品，值得被看见。</h3><p>一份清晰的结构，加上一套可读的视觉规则。</p><a>ENTER →</a></div>;
  if (stage.id === 2) return <div className="calculator-scene"><small>PRODUCT CONFIGURATOR</small><h3>选择你的方案</h3><div>{['基础版', '团队版', '企业版'].map((item, index) => <span className={state === index ? 'selected' : ''} key={item}>{item}</span>)}</div><strong>¥ {state === 0 ? 99 : state === 1 ? 399 : 999} / 月</strong></div>;
  if (stage.id === 3) return <div className="journey-scene"><small>REQUEST JOURNEY</small><div>{['URL', 'DNS', 'TCP + TLS', 'HTTP', 'SERVER'].map((item, index) => <span key={item} className={index <= state + 2 ? 'active' : ''}><i>{index + 1}</i>{item}</span>)}</div><p>一次网页访问，要先找到地址，再连接、请求和下载。</p></div>;
  if (stage.id === 4) return <div className="dashboard-scene"><aside>WH</aside><section><small>欢迎回来</small><h3>{apiError ? '动态数据加载失败' : state ? '你的草稿已保存' : '今天也有新想法吗？'}</h3><div className={apiError ? 'data-error-card' : 'data-card'}><Database size={17} />{apiError ? 'API / 数据库不可用' : '数据库已连接 · 12 篇草稿'}</div></section></div>;
  if (stage.id === 5) return <div className="performance-scene"><small>DELIVERY PATH</small><div className="perf-path"><span>用户</span><ChevronRight /><span>CDN</span><ChevronRight /><span>缓存</span><ChevronRight /><span>数据库</span></div><div className="perf-chart">{[32, 66, 45, 82, 56, 74].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>;
  if (stage.id === 6) return <div className="topology-scene"><div className="gateway-node"><Network size={17} />API 网关</div><div>{['用户服务', '内容服务', '推荐服务', '支付服务'].map((item, index) => <span key={item} className={index === state ? 'active' : ''}><Server size={15} />{item}</span>)}</div><small><i />4 个服务运行正常</small></div>;
  return <div className="ai-scene"><div><Sparkles size={24} /></div><p>{['帮我规划一次新产品发布', '正在检索知识并调用工具…', '计划已生成，等待你确认关键动作'][state]}</p><small>知识检索 → 模型推理 → 工具调用 → 人工确认</small></div>;
}

function LearningPanel({ stage, panel, onPanelChange, node, result, disabled, codeSection, onInspectCode, onToggleNode }: {
  stage: Stage; panel: Panel; onPanelChange: (panel: Panel) => void; node: KnowledgeNode;
  result: ExperimentResult; disabled: Set<string>; codeSection: string;
  onInspectCode: (section: string) => void; onToggleNode: (id: string) => void;
}) {
  return <div className="explain-card">
    <div className="tab-list" role="tablist">
      {([['principle', '原理'], ['flow', '链路'], ['code', '代码'], ['result', '实验结果']] as Array<[Panel, string]>).map(([id, label]) => <button key={id} className={panel === id ? 'is-active' : ''} onClick={() => onPanelChange(id)}>{label}</button>)}
    </div>
    <div className="tab-content">
      {panel === 'principle' && <PrinciplePanel node={node} state={result.states[node.id] || 'on'} disabled={disabled.has(node.id)} onToggle={() => onToggleNode(node.id)} />}
      {panel === 'flow' && <FlowPanel stage={stage} result={result} />}
      {panel === 'code' && <CodeMapPanel stage={stage} activeSection={codeSection} onInspect={onInspectCode} />}
      {panel === 'result' && <ResultPanel result={result} />}
    </div>
  </div>;
}

function PrinciplePanel({ node, state, disabled, onToggle }: { node: KnowledgeNode; state: NodeRuntimeState; disabled: boolean; onToggle: () => void }) {
  return <div className="principle-panel">
    <div className="node-title"><span>{categoryMeta[node.category].label}</span><h3>{node.title}</h3><p>{node.summary}</p></div>
    <dl><div><dt>为什么出现</dt><dd>{node.why}</dd></div><div><dt>位于哪里</dt><dd>{node.where}</dd></div><div><dt>依赖什么</dt><dd>{node.dependencies.length ? node.dependencies.map((id) => knowledgeById[id]?.title || id).join('、') : '这是一个基础节点'}</dd></div></dl>
    <div className={`effect-card is-${state}`}><small>关闭后的影响</small><strong>{node.effect.title}</strong><p>{node.effect.description}</p></div>
    <button className={`node-toggle ${disabled ? 'is-off' : ''}`} onClick={onToggle}><i />{disabled ? `重新启用 ${node.title}` : `关闭 ${node.title} 做实验`}</button>
  </div>;
}

function FlowPanel({ stage, result }: { stage: Stage; result: ExperimentResult }) {
  return <div className="flow-panel"><p>一次操作沿着这条链路向后传递；上游关闭时，下游会被标记为阻断。</p><div className="flow-diagram">{stage.architecture.map((item, index) => <div key={item}><span><FlowIcon index={index} /><b>{item}</b></span>{index < stage.architecture.length - 1 && <i><ChevronRight size={15} /></i>}</div>)}</div><div className="flow-status"><Check size={14} /><span>{result.activeEffects.length ? `${result.activeEffects.length} 个节点关闭或被阻断` : '当前链路全部正常'}</span></div></div>;
}

function FlowIcon({ index }: { index: number }) { const icons = [Globe2, Network, Server, Database, Monitor]; const Icon = icons[index] || Layers3; return <Icon size={17} />; }

function CodeMapPanel({ stage, activeSection, onInspect }: { stage: Stage; activeSection: string; onInspect: (section: string) => void }) {
  const example = codeExamples[stage.id];
  return <div className="code-map-panel"><div className="code-map-intro"><span>CODE → SYSTEM</span><h3>{example.file}</h3><p>{example.intro}</p></div><div className="code-map-list">{example.sections.map((section, index) => <button key={section.id} className={activeSection === section.id ? 'is-active' : ''} onClick={() => onInspect(section.id)}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{section.tag}</small><strong>{section.label}</strong><p>{section.description}</p></span><ChevronRight size={15} /></button>)}</div></div>;
}

function ResultPanel({ result }: { result: ExperimentResult }) {
  return <div className="result-panel"><div className="result-summary"><span className={result.primaryMode === 'healthy' ? 'healthy' : 'warning'}><Activity size={15} />{result.primaryMode === 'healthy' ? '系统正常' : '实验状态'}</span><h3>{result.activeEffects.length ? '关闭组件后，链路发生了这些变化' : '所有组件都在运行'}</h3></div><div className="result-metrics"><Metric label="延迟" value={`${result.metrics.latencyMs} ms`} /><Metric label="源站负载" value={`${result.metrics.originLoad}%`} /><Metric label="带宽" value={`${result.metrics.bandwidthMbps} Mbps`} /><Metric label="错误率" value={`${result.metrics.errorRate}%`} /></div><div className="effect-list">{result.activeEffects.length ? result.activeEffects.slice(0, 8).map(({ node, state }) => <article key={node.id}><i className={`is-${state}`} /><span><strong>{node.title}</strong><small>{state === 'off' ? node.effect.title : '因上游依赖关闭而不可达'}</small></span></article>) : <p>试着关闭左侧任意组件，再回来观察连锁影响。</p>}</div></div>;
}

function CodeViewer({ stage, activeSection, onSectionChange }: { stage: Stage; activeSection: string; onSectionChange: (section: string) => void }) {
  const example = codeExamples[stage.id];
  const current = example.sections.find((section) => section.id === activeSection) || example.sections[0];
  return <div className="code-viewer"><div className="code-filebar"><span><FileCode2 size={13} />{example.file}</span><small>{example.language}</small></div><div className="code-section-tabs">{example.sections.map((section) => <button key={section.id} className={current.id === section.id ? 'is-active' : ''} onClick={() => onSectionChange(section.id)}>{section.label}</button>)}</div><div className="code-scroll"><pre>{example.lines.map((line, index) => { const number = index + 1; const highlighted = number >= current.lines[0] && number <= current.lines[1]; return <span className={`code-line ${highlighted ? 'is-highlighted' : ''}`} key={number}><i>{number}</i><code>{line || ' '}</code></span>; })}</pre></div><div className="code-explainer"><span>{current.tag}</span><p>{current.description}</p></div></div>;
}

function KnowledgeMap({ selectedId, onSelect, onEnterStage }: { selectedId: string; onSelect: (id: string) => void; onEnterStage: (id: number) => void }) {
  const [query, setQuery] = useState('');
  const selected = knowledgeById[selectedId] || knowledgeNodes[0];
  const filtered = knowledgeNodes.filter((node) => `${node.title}${node.summary}${node.why}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="knowledge-map-page"><header><div className="eyebrow"><span>KNOWLEDGE MAP</span><i />五层网站系统</div><h1>先看全貌，再拆一个零件</h1><p>这些知识不是孤立名词。点击任意节点查看它的上下游，再进入首次出现的阶段做关闭实验。</p><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 DNS、路由、数据库、网关…" /></label></header><div className="map-layout"><div className="map-groups">{(Object.keys(categoryMeta) as KnowledgeCategory[]).map((category) => { const Icon = categoryIcons[category]; const nodes = filtered.filter((node) => node.category === category); if (!nodes.length) return null; return <section id={`map-${category}`} key={category}><div className="map-group-title"><Icon size={18} /><span><strong>{categoryMeta[category].label}</strong><small>{categoryMeta[category].description}</small></span></div><div>{nodes.map((node) => <button className={selected.id === node.id ? 'is-active' : ''} key={node.id} onClick={() => onSelect(node.id)}><span>{node.title}</span><small>阶段 {node.introducedAt}</small></button>)}</div></section>; })}</div><aside className="map-detail"><span>{categoryMeta[selected.category].label} · 阶段 {selected.introducedAt}</span><h2>{selected.title}</h2><p>{selected.summary}</p><dl><div><dt>为什么需要</dt><dd>{selected.why}</dd></div><div><dt>链路位置</dt><dd>{selected.where}</dd></div><div><dt>关闭结果</dt><dd>{selected.effect.title}：{selected.effect.description}</dd></div></dl><button onClick={() => onEnterStage(selected.introducedAt)}>进入阶段 {selected.introducedAt} 实验 <ArrowRight size={15} /></button></aside></div></section>;
}

function Glossary({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const filtered = knowledgeNodes.filter((node) => `${node.title}${node.summary}${categoryMeta[node.category].label}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="modal-layer" role="dialog" aria-modal="true"><button className="modal-backdrop" onClick={onClose} aria-label="关闭术语手册" /><section className="glossary-modal"><header><div><small>PLAIN LANGUAGE</small><h2>术语手册</h2><p>每个名词都能回到它所在的系统位置。</p></div><button className="icon-button" onClick={onClose}><X size={20} /></button></header><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索知识点…" /></label><div className="glossary-grid">{filtered.map((node) => <article key={node.id}><small>{categoryMeta[node.category].label} · 阶段 {node.introducedAt}</small><h3>{node.title}</h3><p>{node.summary}</p></article>)}</div></section></div>;
}

export default App;
