import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  CircleHelp,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Globe2,
  Layers3,
  Menu,
  MousePointer2,
  Network,
  Play,
  Server,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { stages, type Stage } from './data';

type Panel = 'story' | 'system' | 'pm';

const stageIcons = [Globe2, MousePointer2, Database, Code2, ShieldCheck, Cloud, Sparkles];

function readStageFromHash() {
  const value = Number(window.location.hash.replace('#stage-', ''));
  return value >= 1 && value <= stages.length ? value : 1;
}

function App() {
  const [activeId, setActiveId] = useState(readStageFromHash);
  const [panel, setPanel] = useState<Panel>('story');
  const [menuOpen, setMenuOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const active = stages[activeId - 1];

  const goToStage = (id: number) => {
    const next = Math.max(1, Math.min(stages.length, id));
    setActiveId(next);
    setPanel('story');
    setMenuOpen(false);
    window.history.replaceState(null, '', `#stage-${next}`);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goToStage(activeId - 1);
      if (event.key === 'ArrowRight') goToStage(activeId + 1);
      if (event.key === 'Escape') {
        setGlossaryOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId]);

  return (
    <div className="app-shell" style={{ '--accent': active.accent } as CSSProperties}>
      <header className="topbar">
        <a className="brand" href="#stage-1" onClick={() => goToStage(1)}>
          <span className="brand-mark"><Network size={19} /></span>
          <span>
            <strong>Web, from zero</strong>
            <small>产品经理的互联网生存指南</small>
          </span>
        </a>
        <nav className="top-actions" aria-label="辅助导航">
          <button className="text-button" onClick={() => setGlossaryOpen(true)}>
            <BookOpen size={16} /> 术语手册
          </button>
          <a className="text-button desktop-only" href="https://github.com/whx8720-ui/oopshui.github.io" target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={14} />
          </a>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="打开章节目录">
            <Menu size={20} />
          </button>
        </nav>
      </header>

      <div className="progress-line"><span style={{ width: `${(activeId / stages.length) * 100}%` }} /></div>

      <aside className={`chapter-drawer ${menuOpen ? 'is-open' : ''}`} aria-label="网页演进章节">
        <div className="drawer-heading">
          <div><small>THE EVOLUTION</small><strong>网页进化史</strong></div>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(false)} aria-label="关闭目录"><X size={19} /></button>
        </div>
        <div className="chapter-list">
          {stages.map((stage, index) => {
            const Icon = stageIcons[index];
            return (
              <button key={stage.id} className={`chapter-item ${activeId === stage.id ? 'is-active' : ''}`} onClick={() => goToStage(stage.id)}>
                <span className="chapter-icon"><Icon size={17} /></span>
                <span className="chapter-copy"><small>{stage.year}</small><strong>{stage.title}</strong></span>
                <span className="chapter-number">0{stage.id}</span>
              </button>
            );
          })}
        </div>
        <div className="drawer-note"><CircleHelp size={17} /><span>把你工作中遇到的问题发给我，它会成为下一张可交互的知识卡。</span></div>
      </aside>

      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="关闭目录" />}

      <main className="main-stage">
        <section className="hero-copy">
          <div className="eyebrow"><span>STAGE 0{active.id}</span><i />{active.era}</div>
          <h1>{active.title}</h1>
          <h2>{active.subtitle}</h2>
          <p>{active.summary}</p>
          <div className="hero-meta">
            <span>{active.year}</span><i />
            <span>{active.productExample}</span>
          </div>
        </section>

        <section className="learning-workbench">
          <div className="demo-column">
            <div className="section-label"><span>01</span> 看见它</div>
            <BrowserDemo stage={active} />
          </div>

          <div className="explain-column">
            <div className="section-label"><span>02</span> 拆开它</div>
            <div className="explain-card">
              <div className="tab-list" role="tablist">
                <button className={panel === 'story' ? 'is-active' : ''} onClick={() => setPanel('story')}>为什么出现</button>
                <button className={panel === 'system' ? 'is-active' : ''} onClick={() => setPanel('system')}>怎么工作</button>
                <button className={panel === 'pm' ? 'is-active' : ''} onClick={() => setPanel('pm')}>PM 怎么问</button>
              </div>
              <div className="tab-content">
                {panel === 'story' && <StoryPanel stage={active} />}
                {panel === 'system' && <SystemPanel stage={active} />}
                {panel === 'pm' && <PmPanel stage={active} />}
              </div>
            </div>
          </div>
        </section>

        <footer className="stage-footer">
          <button onClick={() => goToStage(activeId - 1)} disabled={activeId === 1}><ArrowLeft size={17} /> 上一阶段</button>
          <div><span>{String(activeId).padStart(2, '0')}</span><i /><span>{String(stages.length).padStart(2, '0')}</span></div>
          <button onClick={() => goToStage(activeId + 1)} disabled={activeId === stages.length}>下一阶段 <ArrowRight size={17} /></button>
        </footer>
      </main>

      {glossaryOpen && <Glossary onClose={() => setGlossaryOpen(false)} />}
    </div>
  );
}

function BrowserDemo({ stage }: { stage: Stage }) {
  const [demoState, setDemoState] = useState(0);

  useEffect(() => setDemoState(0), [stage.id]);

  const actionLabels = ['打开页面', '点一下看看', '保存资料', '切换视图', '提交订单', '查看服务', '交给 AI'];

  return (
    <div className="browser-frame">
      <div className="browser-chrome">
        <div className="traffic-lights"><i /><i /><i /></div>
        <div className="address-bar"><ShieldCheck size={12} /> oopshui.dev/stage/{stage.id}</div>
        <span className="chrome-more">•••</span>
      </div>
      <div className={`demo-canvas demo-stage-${stage.id}`}>
        <div className="demo-site-header">
          <span className="demo-logo">O/</span>
          <div><i /><i /><i /></div>
        </div>
        <DemoScene stage={stage} state={demoState} />
        <button className="demo-action" onClick={() => setDemoState((value) => (value + 1) % 3)}>
          <Play size={13} fill="currentColor" /> {actionLabels[stage.id - 1]}
        </button>
        <div className="demo-caption"><span>交互演示</span>{stage.browserLabel}</div>
      </div>
    </div>
  );
}

function DemoScene({ stage, state }: { stage: Stage; state: number }) {
  if (stage.id === 1) {
    return <div className="retro-page"><small>WELCOME TO THE WEB</small><h3>{state ? '你的产品，值得被看见。' : 'Hello, World.'}</h3><p>一份 HTML，向所有人讲同一个故事。</p><a>ENTER →</a></div>;
  }
  if (stage.id === 2) {
    return <div className="calculator"><small>PRICE CONFIGURATOR</small><h3>选择你的方案</h3><div className="option-row"><span className={state === 0 ? 'selected' : ''}>基础版</span><span className={state === 1 ? 'selected' : ''}>团队版</span><span className={state === 2 ? 'selected' : ''}>企业版</span></div><strong>¥ {state === 0 ? '99' : state === 1 ? '399' : '999'} / 月</strong></div>;
  }
  if (stage.id === 3) {
    return <div className="profile-demo"><div className="avatar">WH</div><div><small>欢迎回来</small><h3>{state ? '你的草稿已保存' : '今天也有新想法吗？'}</h3></div><div className="db-pill"><Database size={15} /> 数据库已连接</div></div>;
  }
  if (stage.id === 4) {
    return <div className="dashboard-demo"><aside>{['概览', '内容', '数据'].map((item, index) => <i key={item} className={state === index ? 'active' : ''}>{item}</i>)}</aside><section><small>无需刷新页面</small><h3>{['本周概览', '内容工作台', '增长数据'][state]}</h3><div className="chart-bars">{[48, 76, 56, 88, 67].map((height, index) => <i key={index} style={{ height: `${Math.max(20, height - state * 5 + index * state * 4)}%` }} />)}</div></section></div>;
  }
  if (stage.id === 5) {
    return <div className="order-demo"><div className="order-product"><Box size={28} /><span><small>订单 #20260630</small><strong>年度专业版</strong></span><b>¥ 1,999</b></div><div className="order-steps">{['身份校验', '扣减库存', '支付确认'].map((item, index) => <span key={item} className={index <= state ? 'done' : ''}><i>{index <= state ? <Check size={11} /> : index + 1}</i>{item}</span>)}</div></div>;
  }
  if (stage.id === 6) {
    return <div className="cloud-demo"><div className="gateway"><Network size={19} /> API 网关</div><div className="service-grid">{['用户', '内容', '推荐', '支付'].map((item, index) => <span key={item} className={index === state ? 'pulse' : ''}><Server size={16} />{item}服务</span>)}</div><small><i /> 4 个服务运行正常</small></div>;
  }
  return <div className="ai-demo"><div className="ai-orb"><Sparkles size={25} /></div><div className="ai-message">{['帮我规划一次新产品发布', '正在读取知识库与项目数据…', '已生成计划，等待你确认关键节点'][state]}</div><div className="tool-row"><span>搜索资料</span><ChevronRight size={13} /><span>生成计划</span><ChevronRight size={13} /><span>等待确认</span></div></div>;
}

function StoryPanel({ stage }: { stage: Stage }) {
  return (
    <div className="story-panel">
      <div className="insight-block"><small>它解决了</small>{stage.solves.map((item) => <p key={item}><Check size={15} />{item}</p>)}</div>
      <div className="tradeoff-block"><small>但也带来了</small>{stage.tradeoffs.map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}</div>
    </div>
  );
}

function SystemPanel({ stage }: { stage: Stage }) {
  return (
    <div className="system-panel">
      <div className="flow-diagram">
        {stage.architecture.map((node, index) => (
          <div className="flow-part" key={node}>
            <span><FlowIcon index={index} /><b>{node}</b></span>
            {index < stage.architecture.length - 1 && <i><ChevronRight size={15} /></i>}
          </div>
        ))}
      </div>
      <p className="flow-note"><Zap size={16} /> 点击左侧演示，再沿着这条链路理解“刚才那一下”经过了哪里。</p>
      <div className="term-preview">{stage.terms.map((term) => <span key={term.name}><b>{term.name}</b>{term.description}</span>)}</div>
    </div>
  );
}

function FlowIcon({ index }: { index: number }) {
  const icons = [Globe2, Network, Server, Database];
  const Icon = icons[index] || Layers3;
  return <Icon size={18} />;
}

function PmPanel({ stage }: { stage: Stage }) {
  return (
    <div className="pm-panel">
      <div className="pm-intro"><span>PM LENS</span><h3>技术不是答案，它改变的是你提问的方式。</h3></div>
      <ol>{stage.pmQuestions.map((question, index) => <li key={question}><span>{index + 1}</span><p>{question}</p></li>)}</ol>
      <div className="pm-tip">当研发抛出术语时，先追问：它解决哪一种用户或业务风险？</div>
    </div>
  );
}

function Glossary({ onClose }: { onClose: () => void }) {
  const terms = useMemo(() => stages.flatMap((stage) => stage.terms.map((term) => ({ ...term, stage: stage.title, id: stage.id }))), []);
  const [query, setQuery] = useState('');
  const filtered = terms.filter((term) => `${term.name}${term.description}${term.stage}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="术语手册">
      <button className="modal-backdrop" onClick={onClose} aria-label="关闭术语手册" />
      <section className="glossary-modal">
        <header><div><small>PLAIN LANGUAGE</small><h2>术语手册</h2><p>技术名词，翻译成产品经理能拿去开会的话。</p></div><button className="icon-button" onClick={onClose}><X size={20} /></button></header>
        <label className="search-box"><CircleHelp size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 API、数据库、Agent…" /></label>
        <div className="glossary-grid">{filtered.map((term) => <article key={`${term.id}-${term.name}`}><small>阶段 {term.id} · {term.stage}</small><h3>{term.name}</h3><p>{term.description}</p></article>)}</div>
      </section>
    </div>
  );
}

export default App;
