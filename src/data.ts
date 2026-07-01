export type Stage = {
  id: number;
  era: string;
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  accent: string;
  browserLabel: string;
  productExample: string;
  architecture: string[];
  solves: string[];
  tradeoffs: string[];
  terms: { name: string; description: string }[];
};

export const stages: Stage[] = [
  {
    id: 1, era: '页面骨架', year: '1991—1995', title: '静态网页', subtitle: 'HTML 决定有什么，CSS 决定怎么呈现',
    summary: '从一份最小网页开始，理解浏览器如何把 HTML 结构和 CSS 样式组合成用户看到的页面。',
    accent: '#ff6b4a', browserLabel: '最小可用网页', productExample: 'HTML、语义标签、CSS、盒模型、布局',
    architecture: ['URL', 'HTTP', 'Web 服务器', 'HTML / CSS', '浏览器渲染'],
    solves: ['用统一结构发布内容', '建立清晰的页面视觉层级', '通过链接连接不同资源'],
    tradeoffs: ['所有人看到同一份内容', '内容更新依赖重新发布', '缺少复杂交互和数据记忆'],
    terms: [
      { name: 'HTML', description: '页面的内容与结构，像房子的骨架。' },
      { name: 'CSS', description: '页面的视觉与布局，像房子的装修。' },
      { name: 'DOM', description: '浏览器把 HTML 转换成的树状页面对象。' },
    ],
  },
  {
    id: 2, era: '浏览器交互', year: '1995—2008', title: '网页开始会动', subtitle: 'JavaScript 让页面响应用户',
    summary: '浏览器可以监听点击和输入、记住当前状态，并只更新需要变化的页面区域。',
    accent: '#f0ad35', browserLabel: '可交互的产品配置器', productExample: 'JavaScript、DOM、事件、状态、响应式',
    architecture: ['用户操作', 'DOM 事件', 'JavaScript', '状态更新', '重新渲染'],
    solves: ['操作得到即时反馈', '页面无需每次整页刷新', '界面可以根据状态变化'],
    tradeoffs: ['逻辑复杂度进入浏览器', '刷新后本地状态可能丢失', '无障碍和兼容性更难保证'],
    terms: [
      { name: 'JavaScript', description: '运行在浏览器中的行为逻辑。' },
      { name: '事件', description: '点击、输入等用户动作产生的信号。' },
      { name: '状态', description: '页面当前记住的数据和选择。' },
    ],
  },
  {
    id: 3, era: '上线访问', year: '一次真实访问', title: '网页如何到达你', subtitle: '域名只是入口，背后是一条网络链路',
    summary: '输入网址后，浏览器要经过 DNS、IP、TCP、TLS、HTTP、服务器和资源加载，页面才真正出现。',
    accent: '#2f9b91', browserLabel: '从地址栏到服务器', productExample: 'URL、域名、DNS、IP、端口、公网、HTTP、带宽',
    architecture: ['输入 URL', 'DNS 查 IP', '建立安全连接', '发送 HTTP 请求', '服务器返回资源'],
    solves: ['用域名稳定访问网站', '跨公网找到远程服务器', '安全可靠地传输页面资源'],
    tradeoffs: ['任一链路失败都可能打不开网页', '距离和请求数量带来延迟', '大资源与并发用户竞争带宽'],
    terms: [
      { name: 'DNS', description: '把域名翻译成服务器 IP 地址。' },
      { name: '公网 / 局域网', description: '公网连接全球网络，局域网连接内部设备。' },
      { name: '带宽 / 延迟', description: '带宽决定一次能传多少，延迟决定一次要等多久。' },
    ],
  },
  {
    id: 4, era: '动态数据', year: 'Web 应用', title: '服务器有了记忆', subtitle: '路由、API 和数据库组成动态网站',
    summary: '服务器识别请求和用户，执行路由与业务逻辑，再从数据库读取或保存数据。',
    accent: '#4c77de', browserLabel: '带账户和数据的应用', productExample: '应用服务器、路由、API、鉴权、Session、数据库、CRUD',
    architecture: ['前端应用', 'API 请求', '路由 / 鉴权', '业务逻辑', '数据库'],
    solves: ['保存用户和业务数据', '不同用户看到不同结果', '网页与 App 可以共用后端能力'],
    tradeoffs: ['前后端需要协调接口', '权限与数据正确性成为底线', '更多服务意味着更多失败方式'],
    terms: [
      { name: '路由', description: '根据请求方法和路径找到负责的代码。' },
      { name: 'API', description: '前后端交换数据的约定接口。' },
      { name: '数据库', description: '长期保存并查询业务数据的系统。' },
    ],
  },
  {
    id: 5, era: '速度与流量', year: '增长阶段', title: '网站怎样变快', subtitle: '缓存、CDN、索引和对象存储分担压力',
    summary: '用户和数据变多后，系统通过减少重复计算、就近分发资源和优化查询来保持速度。',
    accent: '#9a67dc', browserLabel: '高流量内容产品', productExample: '缓存、CDN、数据库索引、对象存储、服务器带宽',
    architecture: ['用户', 'CDN 边缘节点', '应用与缓存', '数据库索引', '对象存储'],
    solves: ['降低跨地域访问延迟', '减少数据库和源站压力', '稳定承载图片视频等大文件'],
    tradeoffs: ['缓存会带来数据新鲜度问题', '基础设施成本不再直观', '性能问题需要指标而不是体感判断'],
    terms: [
      { name: '缓存', description: '保存热点结果，避免重复读取和计算。' },
      { name: 'CDN', description: '从离用户更近的节点发送静态资源。' },
      { name: '索引', description: '帮助数据库快速定位数据。' },
    ],
  },
  {
    id: 6, era: '分布式系统', year: '规模化阶段', title: '从一台到一组服务', subtitle: '网关、负载均衡和监控管理复杂系统',
    summary: '单台服务器被拆成多个服务和实例，由统一入口分发流量，并通过日志、监控和扩缩容维持可靠性。',
    accent: '#2c94d2', browserLabel: '多服务业务平台', productExample: '反向代理、负载均衡、API 网关、消息队列、监控、扩缩容',
    architecture: ['公网入口', '反向代理 / 网关', '负载均衡', '多个服务实例', '监控与扩缩容'],
    solves: ['多个团队和服务独立演进', '流量高峰自动增加容量', '部分实例故障时继续服务'],
    tradeoffs: ['调用链和故障定位更复杂', '服务间一致性更难保证', '技术边界开始影响组织协作'],
    terms: [
      { name: 'API 网关', description: '统一处理多服务路由、鉴权和限流。' },
      { name: '负载均衡', description: '把请求分配给多个健康实例。' },
      { name: '可观测性', description: '用日志、指标和链路理解系统内部状态。' },
    ],
  },
  {
    id: 7, era: 'AI 应用', year: '2023—现在', title: '模型进入系统', subtitle: '概率性能力建立在完整网站架构之上',
    summary: 'AI 应用仍需要前端、网络、服务和数据，只是在业务层增加模型、知识检索、工具调用和人工确认。',
    accent: '#df5a8a', browserLabel: '可调用工具的 AI 工作台', productExample: '模型、RAG、Agent、工具调用、安全边界',
    architecture: ['用户意图', 'AI 应用层', '知识检索', '模型与工具', '业务系统'],
    solves: ['自然语言成为操作入口', '自动处理非结构化内容', '根据上下文组织个性化流程'],
    tradeoffs: ['结果具有概率性', '模型成本、延迟与质量相互牵制', '高风险动作必须保留人工确认'],
    terms: [
      { name: '模型', description: '根据输入和上下文生成概率性结果。' },
      { name: 'RAG', description: '先检索资料，再让模型基于资料生成。' },
      { name: 'Agent', description: '能规划、调用工具并根据结果继续行动的系统。' },
    ],
  },
];
