export type KnowledgeCategory = 'frontend' | 'network' | 'backend' | 'data' | 'infrastructure';
export type EffectMode = 'blank' | 'unstyled' | 'inert' | 'dns-error' | 'offline' | 'server-error' | 'not-found' | 'api-error' | 'data-error' | 'slow' | 'gateway-error' | 'degraded';

export type KnowledgeNode = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  introducedAt: number;
  summary: string;
  why: string;
  where: string;
  dependencies: string[];
  codeRef?: { stageId: number; sectionId: string };
  effect: { mode: EffectMode; title: string; description: string };
  hotspots?: Record<number, { x: number; y: number }>;
};

export const categoryMeta: Record<KnowledgeCategory, { label: string; description: string }> = {
  frontend: { label: '前端', description: '浏览器最终画出来、用户能够看到和操作的部分。' },
  network: { label: '地址与网络', description: '请求怎样找到目标，并穿过网络抵达服务器。' },
  backend: { label: '后端', description: '服务器如何接住请求、执行规则并返回结果。' },
  data: { label: '数据', description: '业务信息怎样保存、查询、更新并保持正确。' },
  infrastructure: { label: '基础设施', description: '流量变大后，系统怎样分发、加速、监控和扩容。' },
};

export const knowledgeNodes: KnowledgeNode[] = [
  {
    id: 'html', title: 'HTML', category: 'frontend', introducedAt: 1,
    summary: '描述页面里有什么，是浏览器构建页面结构的原材料。',
    why: '让不同浏览器都能理解标题、段落、图片、链接等内容结构。',
    where: '浏览器解析阶段，先被转换成 DOM。', dependencies: [],
    codeRef: { stageId: 1, sectionId: 'main' },
    effect: { mode: 'blank', title: '页面正文消失', description: '浏览器外壳仍在，但没有 HTML 就没有可以渲染的页面内容。' },
    hotspots: { 1: { x: 49, y: 54 }, 2: { x: 49, y: 54 } },
  },
  {
    id: 'semantic-html', title: '语义标签', category: 'frontend', introducedAt: 1,
    summary: '用 header、main、nav 等标签表达内容角色。',
    why: '帮助浏览器、搜索引擎和辅助技术理解页面，不只是看起来像什么。',
    where: 'HTML 结构层。', dependencies: ['html'], codeRef: { stageId: 1, sectionId: 'header' },
    effect: { mode: 'degraded', title: '内容还在，语义丢失', description: '视觉变化可能不大，但可访问性、SEO 和代码可读性下降。' },
  },
  {
    id: 'css', title: 'CSS', category: 'frontend', introducedAt: 1,
    summary: '控制颜色、字体、间距、布局和响应式表现。',
    why: '把同一份结构适配成清晰、好看并能在不同屏幕使用的界面。',
    where: '浏览器渲染阶段，作用在 DOM 元素上。', dependencies: ['html'], codeRef: { stageId: 1, sectionId: 'head' },
    effect: { mode: 'unstyled', title: '只剩浏览器默认样式', description: 'HTML 骨架仍完整，但布局、颜色和品牌视觉全部消失。' },
    hotspots: { 1: { x: 77, y: 32 }, 2: { x: 72, y: 36 } },
  },
  {
    id: 'box-model', title: '盒模型', category: 'frontend', introducedAt: 1,
    summary: '每个元素由内容、内边距、边框和外边距组成。',
    why: '解释元素为什么占据某块空间，以及间距从哪里来。',
    where: 'CSS 布局计算阶段。', dependencies: ['css'],
    effect: { mode: 'degraded', title: '间距与尺寸混乱', description: '内容还在，但卡片、按钮和区域容易挤在一起或溢出。' },
  },
  {
    id: 'layout', title: '布局', category: 'frontend', introducedAt: 1,
    summary: '使用 Flex、Grid 等规则安排元素的位置和尺寸。',
    why: '让页面从顺序文档变成导航、侧栏、卡片等产品界面。',
    where: 'CSS 布局计算阶段。', dependencies: ['css', 'box-model'],
    effect: { mode: 'degraded', title: '页面退化成单列', description: '颜色和字体可能还在，但元素按普通文档流从上到下排列。' },
  },
  {
    id: 'responsive', title: '响应式设计', category: 'frontend', introducedAt: 2,
    summary: '根据屏幕宽度重新安排布局和交互。',
    why: '同一套内容需要同时服务手机、平板和桌面设备。',
    where: 'CSS 媒体查询与组件布局层。', dependencies: ['css', 'layout'],
    effect: { mode: 'degraded', title: '手机端出现横向溢出', description: '桌面布局被硬塞进小屏幕，需要缩放或左右滚动。' },
  },
  {
    id: 'javascript', title: 'JavaScript', category: 'frontend', introducedAt: 2,
    summary: '负责点击、输入、数据更新等页面行为。',
    why: '让网页从只能阅读的文档变成可操作的应用。',
    where: '浏览器 JavaScript 引擎。', dependencies: ['html'], codeRef: { stageId: 2, sectionId: 'event' },
    effect: { mode: 'inert', title: '界面可见但不能操作', description: '按钮、切换和动态计算全部停止，链接与原生表单可能仍可用。' },
    hotspots: { 2: { x: 47, y: 65 }, 4: { x: 69, y: 58 } },
  },
  {
    id: 'dom', title: 'DOM', category: 'frontend', introducedAt: 2,
    summary: '浏览器把 HTML 转换成的树状对象。',
    why: '代码需要一个可以查找、读取和修改页面元素的接口。',
    where: 'HTML 与 JavaScript 之间。', dependencies: ['html', 'javascript'], codeRef: { stageId: 2, sectionId: 'dom' },
    effect: { mode: 'inert', title: '代码无法定位界面', description: '脚本仍存在，但找不到按钮和内容区域，也就无法更新页面。' },
  },
  {
    id: 'events', title: '事件', category: 'frontend', introducedAt: 2,
    summary: '点击、输入、滚动等用户行为产生的信号。',
    why: '让代码知道用户何时做了什么，并触发对应逻辑。',
    where: 'DOM 与 JavaScript 的交互层。', dependencies: ['javascript', 'dom'], codeRef: { stageId: 2, sectionId: 'event' },
    effect: { mode: 'inert', title: '点击没有反应', description: '页面能显示，状态也存在，但用户行为不会触发任何更新。' },
  },
  {
    id: 'state', title: '状态', category: 'frontend', introducedAt: 2,
    summary: '页面当前记住的数据，例如选中的方案或登录状态。',
    why: '同一个界面需要随着用户操作和数据变化呈现不同结果。',
    where: '浏览器内存或前端框架。', dependencies: ['javascript'], codeRef: { stageId: 2, sectionId: 'state' },
    effect: { mode: 'degraded', title: '界面无法记住选择', description: '每次操作都像第一次，组件之间也无法共享当前信息。' },
  },
  {
    id: 'asset-loading', title: '资源加载', category: 'frontend', introducedAt: 3,
    summary: '浏览器继续下载 CSS、脚本、图片和字体。',
    why: 'HTML 通常只是入口，完整页面由多个资源共同组成。',
    where: 'HTTP 请求与浏览器缓存层。', dependencies: ['html', 'http', 'bandwidth'],
    effect: { mode: 'slow', title: '页面分批出现', description: '文字先出现，样式、图片和脚本随后加载，可能产生闪烁和布局跳动。' },
  },

  {
    id: 'url', title: 'URL', category: 'network', introducedAt: 1,
    summary: '描述协议、域名、端口、路径和参数的完整资源地址。',
    why: '浏览器需要一个统一格式来说明“去哪里、要什么”。',
    where: '地址栏与每一次网络请求的起点。', dependencies: [], codeRef: { stageId: 3, sectionId: 'url' },
    effect: { mode: 'not-found', title: '目标地址不完整', description: '缺少正确路径或参数时，服务器无法知道用户要哪个资源。' },
    hotspots: { 3: { x: 49, y: 8 } },
  },
  {
    id: 'domain', title: '域名', category: 'network', introducedAt: 3,
    summary: '便于人记忆的网站名称，例如 example.com。',
    why: 'IP 可能变化且难记，域名提供稳定的品牌入口。',
    where: 'URL 中，由 DNS 转换成 IP。', dependencies: ['url'], codeRef: { stageId: 3, sectionId: 'dns' },
    effect: { mode: 'dns-error', title: '没有可访问的名称', description: '只能直接输入 IP；品牌入口、证书和多站点配置都会受影响。' },
  },
  {
    id: 'dns', title: 'DNS', category: 'network', introducedAt: 3,
    summary: '把域名查询成服务器 IP 地址。',
    why: '网络设备按 IP 寻址，但人更适合记域名。',
    where: '浏览器真正连接服务器之前。', dependencies: ['domain', 'public-network'], codeRef: { stageId: 3, sectionId: 'dns' },
    effect: { mode: 'dns-error', title: '找不到服务器地址', description: '浏览器在建立连接前就失败，后端和数据库完全没有收到请求。' },
    hotspots: { 3: { x: 23, y: 33 } },
  },
  {
    id: 'ip', title: 'IP 地址', category: 'network', introducedAt: 3,
    summary: '网络中设备或服务端点的数字地址。',
    why: '路由器需要根据 IP 把数据包转发到正确网络。',
    where: 'DNS 结果和网络层。', dependencies: ['public-network'],
    effect: { mode: 'offline', title: '数据包没有目的地', description: '即使域名存在，没有有效 IP 也无法建立连接。' },
  },
  {
    id: 'port', title: '端口', category: 'network', introducedAt: 3,
    summary: '同一台机器上区分不同网络服务的编号。',
    why: '一个 IP 可以同时运行网页、数据库、SSH 等多个服务。',
    where: 'IP 之后、应用服务之前。', dependencies: ['ip', 'tcp'],
    effect: { mode: 'offline', title: '连接到错误服务', description: '服务器在线，但目标端口未开放时会拒绝连接或一直等待。' },
  },
  {
    id: 'lan', title: '局域网', category: 'network', introducedAt: 3,
    summary: '家庭或公司内部设备组成的私有网络。',
    why: '内部设备可高速互联，并与公网隔离。',
    where: '用户设备到路由器，或数据中心内部。', dependencies: [],
    effect: { mode: 'offline', title: '本地设备无法互联', description: '无法访问同一公司或家庭网络中的开发服务和内部系统。' },
  },
  {
    id: 'public-network', title: '公网', category: 'network', introducedAt: 3,
    summary: '连接不同局域网、可被全球路由的互联网。',
    why: '让用户从任意网络访问远程网站。',
    where: '本地路由器与远程服务之间。', dependencies: ['lan'],
    effect: { mode: 'offline', title: '无法连接互联网', description: '局域网内资源可能仍可访问，但远程网站全部不可达。' },
    hotspots: { 3: { x: 49, y: 34 }, 6: { x: 18, y: 48 } },
  },
  {
    id: 'tcp', title: 'TCP', category: 'network', introducedAt: 3,
    summary: '提供可靠、有顺序的数据传输连接。',
    why: '网页资源必须完整到达，丢失的数据需要重传。',
    where: 'IP 与 HTTP/TLS 之间。', dependencies: ['public-network', 'ip'],
    effect: { mode: 'offline', title: '连接无法建立', description: '浏览器无法与服务器形成可靠通道，请求不会进入 HTTP 阶段。' },
  },
  {
    id: 'tls', title: 'TLS / HTTPS', category: 'network', introducedAt: 3,
    summary: '加密浏览器和服务器之间的通信并验证身份。',
    why: '防止密码、Cookie 和内容在传输途中被窃听或篡改。',
    where: 'TCP 连接建立之后、HTTP 内容传输之前。', dependencies: ['tcp', 'domain'],
    effect: { mode: 'degraded', title: '连接不安全', description: '浏览器会警告风险，登录、支付等能力不应继续使用。' },
  },
  {
    id: 'http', title: 'HTTP', category: 'network', introducedAt: 1,
    summary: '浏览器与服务器交换请求和响应的应用层协议。',
    why: '统一说明请求方法、路径、状态码、头部和正文。',
    where: '浏览器与 Web 服务器之间。', dependencies: ['tcp'], codeRef: { stageId: 3, sectionId: 'http' },
    effect: { mode: 'offline', title: '双方无法理解请求', description: '连接即使存在，也没有统一规则表达 GET、404 或响应内容。' },
  },
  {
    id: 'latency', title: '网络延迟', category: 'network', introducedAt: 3,
    summary: '数据往返一次需要等待的时间。',
    why: '用户距离、网络路径和连接次数都会影响交互速度。',
    where: '整条网络链路。', dependencies: ['public-network'],
    effect: { mode: 'slow', title: '每个请求都慢半拍', description: '页面最终可用，但点击反馈和多次串行请求明显变慢。' },
  },
  {
    id: 'bandwidth', title: '服务器带宽', category: 'network', introducedAt: 3,
    summary: '单位时间内能够传输的数据量。',
    why: '图片、视频和大量并发用户会竞争同一出口容量。',
    where: '用户网络、CDN 或源站出口。', dependencies: ['public-network'],
    effect: { mode: 'slow', title: '大资源排队加载', description: 'HTML 可能很快出现，但图片、视频和脚本需要更久才能传完。' },
    hotspots: { 3: { x: 74, y: 34 }, 5: { x: 73, y: 30 } },
  },

  {
    id: 'web-server', title: 'Web 服务器', category: 'backend', introducedAt: 1,
    summary: '监听网络端口、接收 HTTP 请求并返回资源。',
    why: '浏览器需要一个始终在线的远程进程提供网页。',
    where: '网络请求到达后的第一站。', dependencies: ['http', 'port'], codeRef: { stageId: 3, sectionId: 'server' },
    effect: { mode: 'server-error', title: '服务器没有响应', description: '浏览器可能显示连接被拒绝、超时或 503。' },
    hotspots: { 3: { x: 79, y: 51 }, 4: { x: 75, y: 30 } },
  },
  {
    id: 'app-server', title: '应用服务器', category: 'backend', introducedAt: 4,
    summary: '运行登录、订单、内容等业务逻辑。',
    why: '静态文件无法根据用户和数据执行复杂规则。',
    where: 'Web 服务器之后、数据库之前。', dependencies: ['web-server'], codeRef: { stageId: 4, sectionId: 'route' },
    effect: { mode: 'server-error', title: '业务逻辑停止', description: '静态文件可能正常，但登录、保存和动态内容全部失败。' },
  },
  {
    id: 'route', title: '后端路由', category: 'backend', introducedAt: 4,
    summary: '根据方法和路径把请求交给对应业务代码。',
    why: '同一个服务需要处理用户、文章、订单等不同入口。',
    where: '应用服务器入口。', dependencies: ['app-server', 'http'], codeRef: { stageId: 4, sectionId: 'route' },
    effect: { mode: 'not-found', title: '返回 404', description: '服务器在线，但没有代码负责当前路径。' },
    hotspots: { 4: { x: 60, y: 38 } },
  },
  {
    id: 'api', title: 'API', category: 'backend', introducedAt: 4,
    summary: '前端和后端约定的数据交换接口。',
    why: '前后端可以独立开发，并让网页、App 和第三方复用能力。',
    where: '前端请求与后端路由之间。', dependencies: ['javascript', 'route'], codeRef: { stageId: 4, sectionId: 'api' },
    effect: { mode: 'api-error', title: '页面壳正常，动态数据失败', description: '导航和静态文案仍在，列表、用户资料等区域显示请求错误。' },
    hotspots: { 4: { x: 47, y: 56 }, 6: { x: 43, y: 46 } },
  },
  {
    id: 'auth', title: '鉴权', category: 'backend', introducedAt: 4,
    summary: '确认用户身份以及允许执行的操作。',
    why: '不能让任何人查看私有数据或修改他人的内容。',
    where: 'API 与业务逻辑入口。', dependencies: ['api'], codeRef: { stageId: 4, sectionId: 'session' },
    effect: { mode: 'api-error', title: '私有操作被拒绝', description: '公开内容可访问，但个人资料、编辑和管理能力返回 401/403。' },
  },
  {
    id: 'cookie-session', title: 'Cookie / Session', category: 'backend', introducedAt: 4,
    summary: '在多次请求之间识别同一个用户。',
    why: 'HTTP 请求彼此独立，登录状态需要额外机制延续。',
    where: '浏览器 Cookie 与服务器会话存储之间。', dependencies: ['auth', 'tls'], codeRef: { stageId: 4, sectionId: 'session' },
    effect: { mode: 'degraded', title: '每次请求都像陌生人', description: '用户会反复掉线，个性化内容和购物车无法延续。' },
  },
  {
    id: 'static-assets', title: '静态资源服务', category: 'backend', introducedAt: 3,
    summary: '向浏览器提供 CSS、脚本、图片和字体文件。',
    why: '页面资源适合直接传输，不必每次执行应用逻辑。',
    where: 'Web 服务器或 CDN。', dependencies: ['web-server', 'asset-loading'],
    effect: { mode: 'degraded', title: '页面资源缺失', description: 'HTML 可能出现，但样式、图片或脚本返回 404。' },
  },

  {
    id: 'database', title: '数据库', category: 'data', introducedAt: 4,
    summary: '长期保存并查询用户和业务数据。',
    why: '服务器重启后数据不能丢，并需要支持多人并发读写。',
    where: '应用服务器之后。', dependencies: ['app-server'], codeRef: { stageId: 4, sectionId: 'database' },
    effect: { mode: 'data-error', title: '动态数据不可用', description: '静态页面正常，但登录、列表、保存和订单等数据能力失败。' },
    hotspots: { 4: { x: 76, y: 67 }, 5: { x: 72, y: 66 } },
  },
  {
    id: 'crud', title: 'CRUD', category: 'data', introducedAt: 4,
    summary: '创建、读取、更新和删除数据的四类基本操作。',
    why: '绝大多数业务功能最终都会改变某种数据。',
    where: '业务逻辑与数据库之间。', dependencies: ['database', 'api'],
    effect: { mode: 'data-error', title: '数据只能看不能改', description: '根据缺失的操作，新增、编辑或删除会失败。' },
  },
  {
    id: 'index', title: '数据库索引', category: 'data', introducedAt: 5,
    summary: '为常用查询建立快速定位结构。',
    why: '数据量变大后，全表逐行查找会越来越慢。',
    where: '数据库内部。', dependencies: ['database'],
    effect: { mode: 'slow', title: '查询随数据量变慢', description: '功能正确，但搜索、排序和列表接口延迟显著上升。' },
  },
  {
    id: 'transaction', title: '事务', category: 'data', introducedAt: 5,
    summary: '让一组数据操作全部成功或全部撤销。',
    why: '支付成功但订单没保存、库存扣一半都是不可接受的中间状态。',
    where: '数据库和核心业务逻辑。', dependencies: ['database'],
    effect: { mode: 'degraded', title: '可能出现半成功数据', description: '单个操作仍能执行，但异常时无法保证业务整体一致。' },
  },
  {
    id: 'cache', title: '缓存', category: 'data', introducedAt: 5,
    summary: '把热点数据放在更快的存储中。',
    why: '减少重复计算和数据库压力，缩短读取时间。',
    where: '应用服务器与数据库之间，或浏览器/CDN。', dependencies: ['database', 'app-server'], codeRef: { stageId: 5, sectionId: 'cache' },
    effect: { mode: 'slow', title: '功能正常但响应变慢', description: '所有请求回源数据库，延迟和数据库负载上升。' },
    hotspots: { 5: { x: 48, y: 55 } },
  },
  {
    id: 'object-storage', title: '对象存储', category: 'data', introducedAt: 5,
    summary: '专门保存图片、视频、附件等大文件。',
    why: '大文件不适合塞进应用服务器磁盘或普通数据库。',
    where: '应用服务之外，通常与 CDN 配合。', dependencies: ['api', 'public-network'],
    effect: { mode: 'degraded', title: '图片和附件不可用', description: '结构化数据仍在，但上传、下载和媒体展示失败。' },
  },

  {
    id: 'cdn', title: 'CDN', category: 'infrastructure', introducedAt: 5,
    summary: '从距离用户更近的边缘节点分发静态资源。',
    why: '降低跨地域延迟和源站出口带宽压力。',
    where: '用户与源站之间。', dependencies: ['static-assets', 'public-network'], codeRef: { stageId: 5, sectionId: 'cdn' },
    effect: { mode: 'slow', title: '资源全部回源', description: '网站仍能使用，但远距离用户更慢，源站带宽和请求数上升。' },
    hotspots: { 5: { x: 25, y: 34 } },
  },
  {
    id: 'reverse-proxy', title: '反向代理', category: 'infrastructure', introducedAt: 6,
    summary: '代表内部服务器接收外部请求。',
    why: '隐藏内部结构，并统一处理 TLS、压缩和转发。',
    where: '公网入口与应用服务之间。', dependencies: ['web-server', 'public-network'],
    effect: { mode: 'server-error', title: '统一入口失效', description: '内部服务可能仍在线，但外部用户无法到达。' },
  },
  {
    id: 'load-balancer', title: '负载均衡', category: 'infrastructure', introducedAt: 6,
    summary: '把请求分配给多个可用服务实例。',
    why: '单台服务器容量有限，也需要在故障时绕过坏节点。',
    where: '反向代理或网关之后、服务实例之前。', dependencies: ['reverse-proxy'], codeRef: { stageId: 6, sectionId: 'scale' },
    effect: { mode: 'degraded', title: '退化为单点服务', description: '低流量时仍可用，但容量下降，单台故障会导致整体中断。' },
  },
  {
    id: 'api-gateway', title: 'API 网关', category: 'infrastructure', introducedAt: 6,
    summary: '统一管理多服务路由、鉴权、限流和审计。',
    why: '服务变多后，客户端不应了解每个内部地址和共同规则。',
    where: '外部客户端与微服务之间。', dependencies: ['reverse-proxy', 'api'], codeRef: { stageId: 6, sectionId: 'gateway' },
    effect: { mode: 'gateway-error', title: '多服务请求无法分发', description: '静态入口可能仍在，但用户、内容、推荐等 API 找不到对应服务。' },
    hotspots: { 6: { x: 43, y: 38 } },
  },
  {
    id: 'message-queue', title: '消息队列', category: 'infrastructure', introducedAt: 6,
    summary: '异步暂存任务，让生产者和消费者解耦。',
    why: '发邮件、转码等慢任务不应阻塞用户请求，也要应对流量峰值。',
    where: '业务服务之间。', dependencies: ['app-server'],
    effect: { mode: 'degraded', title: '慢任务阻塞或丢失', description: '请求需要同步等待，流量高峰时更容易超时。' },
  },
  {
    id: 'logs', title: '日志', category: 'infrastructure', introducedAt: 6,
    summary: '记录系统发生过的事件和错误上下文。',
    why: '线上问题无法靠复现猜测，需要追溯当时发生了什么。',
    where: '浏览器、网关、服务和数据库各层。', dependencies: ['app-server'],
    effect: { mode: 'degraded', title: '故障变成黑盒', description: '功能暂时不变，但出错后无法定位用户、请求和代码位置。' },
  },
  {
    id: 'monitoring', title: '监控', category: 'infrastructure', introducedAt: 6,
    summary: '持续汇总延迟、错误、流量和资源指标。',
    why: '在用户大规模投诉前发现异常和趋势。',
    where: '整条系统链路之上。', dependencies: ['logs'], codeRef: { stageId: 6, sectionId: 'observe' },
    effect: { mode: 'degraded', title: '系统失去仪表盘', description: '服务仍运行，但团队无法及时知道哪里变慢或正在失败。' },
    hotspots: { 6: { x: 75, y: 69 } },
  },
  {
    id: 'autoscaling', title: '自动扩缩容', category: 'infrastructure', introducedAt: 6,
    summary: '根据负载自动增加或减少服务实例。',
    why: '流量会波动，固定容量要么浪费、要么高峰不够。',
    where: '云资源和容器编排层。', dependencies: ['monitoring', 'load-balancer'], codeRef: { stageId: 6, sectionId: 'scale' },
    effect: { mode: 'degraded', title: '容量固定', description: '平时仍可用，高峰时请求排队或失败，低谷时浪费资源。' },
  },
];

export const knowledgeById = Object.fromEntries(knowledgeNodes.map((node) => [node.id, node])) as Record<string, KnowledgeNode>;

export const stageNodeIds: Record<number, string[]> = {
  1: ['html', 'semantic-html', 'css', 'box-model', 'layout', 'url', 'http', 'web-server'],
  2: ['html', 'semantic-html', 'css', 'box-model', 'layout', 'responsive', 'javascript', 'dom', 'events', 'state', 'url', 'http', 'web-server'],
  3: ['html', 'css', 'javascript', 'asset-loading', 'url', 'domain', 'dns', 'ip', 'port', 'lan', 'public-network', 'tcp', 'tls', 'http', 'latency', 'bandwidth', 'web-server', 'static-assets'],
  4: ['html', 'css', 'javascript', 'dom', 'events', 'state', 'asset-loading', 'url', 'domain', 'dns', 'ip', 'port', 'lan', 'public-network', 'tcp', 'tls', 'http', 'latency', 'bandwidth', 'web-server', 'app-server', 'route', 'api', 'auth', 'cookie-session', 'static-assets', 'database', 'crud'],
  5: ['html', 'css', 'javascript', 'asset-loading', 'url', 'domain', 'dns', 'public-network', 'tcp', 'tls', 'http', 'latency', 'bandwidth', 'web-server', 'app-server', 'route', 'api', 'static-assets', 'database', 'crud', 'index', 'transaction', 'cache', 'object-storage', 'cdn'],
  6: knowledgeNodes.filter((node) => node.introducedAt <= 6).map((node) => node.id),
  7: knowledgeNodes.map((node) => node.id),
};
