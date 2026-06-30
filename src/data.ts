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
  pmQuestions: string[];
  terms: { name: string; description: string }[];
};

export const stages: Stage[] = [
  {
    id: 1,
    era: '信息发布',
    year: '1991—1995',
    title: '静态网页',
    subtitle: '网页像一张数字海报',
    summary: '服务器把提前写好的 HTML 文件原样交给浏览器。所有人看到同一份内容，交互主要靠超链接。',
    accent: '#ff7a59',
    browserLabel: '世界上第一个产品主页',
    productExample: '品牌官网、活动落地页、产品说明书',
    architecture: ['浏览器', 'HTTP 请求', 'Web 服务器', 'HTML 文件'],
    solves: ['低成本向全世界发布信息', '通过链接连接不同页面', '内容可被搜索引擎发现'],
    tradeoffs: ['每次改文案都要改文件并重新发布', '无法记住用户', '不适合高频更新'],
    pmQuestions: ['这页真的需要后端吗？', '核心信息是否无需登录也能访问？', '发布频率和维护责任人是谁？'],
    terms: [
      { name: 'HTML', description: '网页的内容与结构，像房子的骨架。' },
      { name: 'URL', description: '资源在互联网上的地址。' },
      { name: 'HTTP', description: '浏览器和服务器交换信息时遵守的规则。' },
    ],
  },
  {
    id: 2,
    era: '本地交互',
    year: '1995—2000',
    title: '浏览器开始会动',
    subtitle: 'JavaScript 把海报变成小工具',
    summary: '脚本在用户的浏览器中运行，表单校验、菜单、动画和即时反馈不再需要每次都找服务器。',
    accent: '#f4b942',
    browserLabel: '会计算价格的产品配置器',
    productExample: '计算器、问卷、商品配置器、小游戏',
    architecture: ['用户操作', 'JavaScript', '浏览器状态', '页面更新'],
    solves: ['操作有即时反馈', '减少无意义的网络请求', '能做出更丰富的交互体验'],
    tradeoffs: ['刷新页面后状态容易丢失', '不同浏览器兼容性复杂', '逻辑多了以后难维护'],
    pmQuestions: ['反馈应该多快出现？', '校验在前端还是后端完成？', '无 JavaScript 时是否需要降级？'],
    terms: [
      { name: 'JavaScript', description: '运行在浏览器里的编程语言，负责网页行为。' },
      { name: 'DOM', description: '浏览器眼中的页面结构，脚本可以读取和修改它。' },
      { name: '事件', description: '点击、输入、滚动等用户行为触发的信号。' },
    ],
  },
  {
    id: 3,
    era: '数据驱动',
    year: '2000—2008',
    title: '动态网站',
    subtitle: '服务器有了记忆',
    summary: '后端根据用户身份和数据库内容，现场拼出不同页面。注册、登录、发帖和订单成为可能。',
    accent: '#35a7a0',
    browserLabel: '有账号体系的社区',
    productExample: '论坛、博客、会员中心、早期电商',
    architecture: ['浏览器', 'Web 服务器', '业务逻辑', '数据库'],
    solves: ['保存用户和业务数据', '不同用户看到不同内容', '支持多人共同使用'],
    tradeoffs: ['每次操作常伴随整页刷新', '前后端代码容易混在一起', '服务器压力成为瓶颈'],
    pmQuestions: ['哪些数据必须长期保存？', '用户身份如何确认？', '失败后数据能否恢复？'],
    terms: [
      { name: '后端', description: '运行在服务器上的业务逻辑，用户无法直接看到。' },
      { name: '数据库', description: '按规则长期保存、查询和更新数据的系统。' },
      { name: 'Cookie / Session', description: '让服务器在多次请求之间认出同一个用户。' },
    ],
  },
  {
    id: 4,
    era: '应用体验',
    year: '2008—2015',
    title: '单页应用',
    subtitle: '网页越来越像 App',
    summary: '页面首次加载后，前端只向后端要数据并局部更新界面，切换视图时不再频繁白屏。',
    accent: '#4f78e8',
    browserLabel: '实时协作工作台',
    productExample: '在线文档、项目管理、数据后台',
    architecture: ['前端应用', 'API 请求', '后端服务', 'JSON 数据'],
    solves: ['流畅的局部刷新', '前后端可以独立开发', '复杂交互可拆成组件'],
    tradeoffs: ['首屏代码包可能很大', 'SEO 与分享预览更难', '前端状态管理变复杂'],
    pmQuestions: ['哪些状态需要实时同步？', '加载失败时界面如何解释？', '首屏速度是否影响转化？'],
    terms: [
      { name: 'SPA', description: '单页应用；用一个页面壳承载多个视图。' },
      { name: 'API', description: '不同软件约定好的数据交换窗口。' },
      { name: 'JSON', description: '前后端常用的轻量数据格式。' },
    ],
  },
  {
    id: 5,
    era: '规模化业务',
    year: '2015—2020',
    title: '复杂业务系统',
    subtitle: '体验之外，还要正确与可靠',
    summary: '电商、支付和企业软件把权限、库存、资金与流程带进系统，架构开始围绕一致性、安全和高并发设计。',
    accent: '#9b6de3',
    browserLabel: '大促中的交易系统',
    productExample: '电商平台、支付系统、企业 SaaS',
    architecture: ['多端用户', '网关与鉴权', '业务服务', '数据库 / 缓存'],
    solves: ['多人多角色协作', '交易数据保持正确', '高峰流量下持续服务'],
    tradeoffs: ['规则和异常分支急剧增加', '测试与发布成本上升', '一个改动可能影响整条链路'],
    pmQuestions: ['核心链路的正确性如何验收？', '权限边界是否清晰？', '峰值容量和降级方案是什么？'],
    terms: [
      { name: '鉴权', description: '确认你是谁，以及你能做什么。' },
      { name: '缓存', description: '把常用数据放在更快的位置，减少重复计算。' },
      { name: '事务', description: '一组操作要么全部成功，要么全部撤销。' },
    ],
  },
  {
    id: 6,
    era: '平台化',
    year: '2020—2023',
    title: '云与微服务',
    subtitle: '把大系统拆成可协作的组织',
    summary: '大型系统被拆成相对独立的服务，在统一云基础设施上部署、监控和扩缩容，让多个团队并行交付。',
    accent: '#2d9cdb',
    browserLabel: '统一业务平台',
    productExample: '开放平台、中台、全球化 SaaS',
    architecture: ['客户端', 'API 网关', '多个微服务', '云资源与监控'],
    solves: ['团队可以独立发布', '资源按流量弹性伸缩', '故障定位与运行状态可观察'],
    tradeoffs: ['服务之间的调用链更复杂', '基础设施成本不再直观', '组织边界会影响技术边界'],
    pmQuestions: ['这是产品能力还是平台能力？', 'SLA 应该如何定义？', '成本如何分摊到业务？'],
    terms: [
      { name: '微服务', description: '围绕业务能力拆分、可独立部署的小型服务。' },
      { name: 'API 网关', description: '统一接收流量，再转发给内部服务的入口。' },
      { name: '可观测性', description: '通过指标、日志和链路了解系统内部发生了什么。' },
    ],
  },
  {
    id: 7,
    era: '智能生成',
    year: '2023—现在',
    title: 'AI 原生产品',
    subtitle: '界面与流程开始动态生成',
    summary: '模型不只返回固定数据，还能理解自然语言、生成内容、调用工具，并根据上下文组织下一步行动。',
    accent: '#e75d8d',
    browserLabel: '会规划任务的 AI 工作台',
    productExample: 'Copilot、智能客服、内容生产 Agent',
    architecture: ['用户意图', 'AI 应用层', '模型与工具', '知识 / 业务系统'],
    solves: ['自然语言成为新入口', '非结构化任务可被自动化', '千人千面的内容与流程'],
    tradeoffs: ['结果具有概率性', '成本、延迟和质量相互牵制', '安全与责任边界需要重画'],
    pmQuestions: ['何时必须让用户确认？', '如何评估概率性结果？', '失败时怎样透明地回退？'],
    terms: [
      { name: '大语言模型', description: '从海量文本中学习语言规律并生成结果的模型。' },
      { name: 'Agent', description: '能规划步骤、调用工具并根据结果继续行动的 AI 系统。' },
      { name: 'RAG', description: '先检索可信资料，再让模型基于资料生成答案。' },
    ],
  },
];
