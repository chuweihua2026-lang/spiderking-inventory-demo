import {
  BarChart3,
  Boxes,
  ClipboardList,
  Home,
  Package,
  PackagePlus,
  RefreshCcw,
  Settings,
  ShoppingCart,
  Store,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";

type Page =
  | "dashboard"
  | "products"
  | "inventory"
  | "receiving"
  | "transfer"
  | "pos"
  | "returns"
  | "stocktake"
  | "members"
  | "analytics"
  | "settings";

type Role = "老板（全部权限）" | "经理" | "总店长" | "店长" | "导购";

type StoreInfo = {
  id: string;
  name: string;
  brand: string;
};

type Sku = {
  id: string;
  sku: string;
  brand: string;
  articleNo: string;
  color: string;
  size: string;
  category: string;
  cost: number;
  retail: number;
  status: "在售" | "停用";
};

type StockMap = Record<string, Record<string, number>>;

type Member = {
  id: string;
  name: string;
  phone: string;
  storeId: string;
  guide: string;
  level: string;
  points: number;
  balance: number;
};

type SaleOrder = {
  id: string;
  storeId: string;
  guide: string;
  memberId?: string;
  amount: number;
  pay: string;
  time: string;
};

type Stocktake = {
  id: string;
  storeId: string;
  status: "草稿" | "已完成";
  createdAt: string;
  rows: { skuId: string; book: number; counted: number }[];
};

const stores: StoreInfo[] = [
  { id: "s1", name: "蜘蛛王一店", brand: "蜘蛛王" },
  { id: "s2", name: "蜘蛛王二店", brand: "蜘蛛王" },
  { id: "s3", name: "邦赛一店", brand: "邦赛" },
  { id: "s4", name: "邦赛二店", brand: "邦赛" },
  { id: "s5", name: "澳伦总店", brand: "澳伦" }
];

const seedSkus: Sku[] = [
  { id: "sku1", sku: "SPK-2601-BK-39", brand: "蜘蛛王", articleNo: "SPK-2601", color: "黑色", size: "39", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku2", sku: "SPK-2601-BK-40", brand: "蜘蛛王", articleNo: "SPK-2601", color: "黑色", size: "40", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku3", sku: "SPK-2601-BK-41", brand: "蜘蛛王", articleNo: "SPK-2601", color: "黑色", size: "41", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku4", sku: "SPK-2601-BK-42", brand: "蜘蛛王", articleNo: "SPK-2601", color: "黑色", size: "42", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku5", sku: "SPK-2601-BR-39", brand: "蜘蛛王", articleNo: "SPK-2601", color: "棕色", size: "39", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku6", sku: "SPK-2601-BR-40", brand: "蜘蛛王", articleNo: "SPK-2601", color: "棕色", size: "40", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku7", sku: "SPK-2601-BR-41", brand: "蜘蛛王", articleNo: "SPK-2601", color: "棕色", size: "41", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku8", sku: "SPK-2601-BR-42", brand: "蜘蛛王", articleNo: "SPK-2601", color: "棕色", size: "42", category: "商务皮鞋", cost: 350, retail: 599, status: "在售" },
  { id: "sku9", sku: "BSA-L602-BK-38", brand: "邦赛", articleNo: "BSA-L602", color: "黑色", size: "38", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku10", sku: "BSA-L602-BK-39", brand: "邦赛", articleNo: "BSA-L602", color: "黑色", size: "39", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku11", sku: "BSA-L602-BK-40", brand: "邦赛", articleNo: "BSA-L602", color: "黑色", size: "40", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku12", sku: "BSA-L602-BR-38", brand: "邦赛", articleNo: "BSA-L602", color: "棕色", size: "38", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku13", sku: "BSA-L602-BR-39", brand: "邦赛", articleNo: "BSA-L602", color: "棕色", size: "39", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku14", sku: "BSA-L602-BR-40", brand: "邦赛", articleNo: "BSA-L602", color: "棕色", size: "40", category: "休闲女鞋", cost: 280, retail: 499, status: "在售" },
  { id: "sku15", sku: "AOL-M301-BK-38", brand: "澳伦", articleNo: "AOL-M301", color: "黑色", size: "38", category: "妈妈鞋", cost: 260, retail: 459, status: "在售" },
  { id: "sku16", sku: "AOL-M301-BK-39", brand: "澳伦", articleNo: "AOL-M301", color: "黑色", size: "39", category: "妈妈鞋", cost: 260, retail: 459, status: "在售" },
  { id: "sku17", sku: "AOL-M301-BK-40", brand: "澳伦", articleNo: "AOL-M301", color: "黑色", size: "40", category: "妈妈鞋", cost: 260, retail: 459, status: "在售" },
  { id: "sku18", sku: "AOL-M301-BK-41", brand: "澳伦", articleNo: "AOL-M301", color: "黑色", size: "41", category: "妈妈鞋", cost: 260, retail: 459, status: "在售" },
  { id: "sku19", sku: "AOL-M301-BK-42", brand: "澳伦", articleNo: "AOL-M301", color: "黑色", size: "42", category: "妈妈鞋", cost: 260, retail: 459, status: "在售" }
];

const seedStock: StockMap = {
  sku1: { s1: 5, s2: 3 },
  sku2: { s1: 8, s2: 2 },
  sku3: { s1: 3, s2: -1 },
  sku4: { s2: 4 },
  sku5: { s1: 2, s2: 6 },
  sku6: { s1: 4, s2: 1 },
  sku7: { s1: 1 },
  sku8: { s2: 3 },
  sku9: { s3: 4, s4: 2 },
  sku10: { s3: 7, s4: 5 },
  sku11: { s3: 11, s4: 1 },
  sku12: { s3: 3 },
  sku13: { s3: 2, s4: 4 },
  sku14: { s4: 3 },
  sku15: { s5: 10 },
  sku16: { s5: 15 },
  sku17: { s5: 8 },
  sku18: { s5: 5 },
  sku19: { s5: 3 }
};

const seedMembers: Member[] = [
  { id: "m1", name: "李姐", phone: "138****2688", storeId: "s1", guide: "小美", level: "金卡", points: 2380, balance: 600 },
  { id: "m2", name: "王五", phone: "139****8801", storeId: "s2", guide: "小陈", level: "银卡", points: 980, balance: 0 },
  { id: "m3", name: "陈七", phone: "137****3366", storeId: "s5", guide: "小周", level: "钻石", points: 5200, balance: 1800 }
];

const fmt = (value: number) => `¥${value.toLocaleString("zh-CN")}`;
const serial = (prefix: string) => `${prefix}${Date.now().toString().slice(-10)}`;

export function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [role, setRole] = useState<Role>("老板（全部权限）");
  const [brandFilter, setBrandFilter] = useState("全部品牌");
  const [skus, setSkus] = useState<Sku[]>(seedSkus);
  const [stock, setStock] = useState<StockMap>(seedStock);
  const [members] = useState<Member[]>(seedMembers);
  const [toast, setToast] = useState("");
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [skuForm, setSkuForm] = useState({ brand: "蜘蛛王", articleNo: "", color: "", size: "", sku: "", cost: "", retail: "" });
  const [receivingStore, setReceivingStore] = useState("s1");
  const [receivingSku, setReceivingSku] = useState("sku1");
  const [receivingQty, setReceivingQty] = useState(10);
  const [receipts, setReceipts] = useState<{ id: string; storeId: string; skuId: string; qty: number; time: string }[]>([]);
  const [pos, setPos] = useState({ storeId: "", guide: "", memberId: "", skuId: "", qty: 1, pay: "微信" });
  const [sales, setSales] = useState<SaleOrder[]>([]);
  const [stocktakes, setStocktakes] = useState<Stocktake[]>([]);
  const [activeStocktake, setActiveStocktake] = useState<Stocktake | null>(null);

  const visibleSkus = useMemo(() => skus.filter((sku) => brandFilter === "全部品牌" || sku.brand === brandFilter), [skus, brandFilter]);
  const totalStock = useMemo(() => Object.values(stock).flatMap((row) => Object.values(row)).reduce((sum, qty) => sum + qty, 0), [stock]);
  const totalCost = useMemo(() => skus.reduce((sum, sku) => sum + (Object.values(stock[sku.id] ?? {}).reduce((a, b) => a + Math.max(b, 0), 0) * sku.cost), 0), [skus, stock]);
  const negativeCount = useMemo(() => Object.values(stock).flatMap((row) => Object.values(row)).filter((qty) => qty < 0).length, [stock]);

  const nav = [
    { id: "dashboard" as Page, label: "经营驾驶舱", icon: Home },
    { id: "products" as Page, label: "商品中心", icon: Package },
    { id: "inventory" as Page, label: "库存中心", icon: Boxes },
    { id: "receiving" as Page, label: "入库管理", icon: PackagePlus },
    { id: "transfer" as Page, label: "门店调拨", icon: RefreshCcw },
    { id: "pos" as Page, label: "门店收银", icon: ShoppingCart },
    { id: "returns" as Page, label: "退换货", icon: ClipboardList },
    { id: "stocktake" as Page, label: "门店盘点", icon: ClipboardList },
    { id: "members" as Page, label: "会员CRM", icon: Users },
    { id: "analytics" as Page, label: "分析预警", icon: BarChart3 },
    { id: "settings" as Page, label: "系统设置", icon: Settings }
  ];

  const pushToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const updateStock = (skuId: string, storeId: string, delta: number) => {
    setStock((prev) => ({
      ...prev,
      [skuId]: {
        ...(prev[skuId] ?? {}),
        [storeId]: (prev[skuId]?.[storeId] ?? 0) + delta
      }
    }));
  };

  const addSku = () => {
    const id = `sku${Date.now()}`;
    const item: Sku = {
      id,
      sku: skuForm.sku || `${skuForm.articleNo}-${skuForm.color}-${skuForm.size}`,
      brand: skuForm.brand,
      articleNo: skuForm.articleNo,
      color: skuForm.color,
      size: skuForm.size,
      category: skuForm.brand === "邦赛" ? "休闲女鞋" : skuForm.brand === "澳伦" ? "妈妈鞋" : "商务皮鞋",
      cost: Number(skuForm.cost || 0),
      retail: Number(skuForm.retail || 0),
      status: "在售"
    };
    setSkus((rows) => [item, ...rows]);
    setShowSkuModal(false);
    setPage("inventory");
    pushToast(`SKU ${item.sku} 添加成功（演示）`);
  };

  const submitReceipt = () => {
    updateStock(receivingSku, receivingStore, receivingQty);
    setReceipts((rows) => [
      { id: serial("RK"), storeId: receivingStore, skuId: receivingSku, qty: receivingQty, time: "2026/7/5 13:42:18" },
      ...rows
    ]);
    pushToast(`入库成功，库存已更新（演示）`);
  };

  const submitSale = () => {
    const sku = skus.find((item) => item.id === pos.skuId);
    if (!pos.storeId || !pos.guide || !sku) {
      pushToast("请先选择门店、导购和商品");
      return;
    }
    const amount = sku.retail * pos.qty;
    updateStock(sku.id, pos.storeId, -pos.qty);
    setSales((rows) => [
      { id: serial("SD"), storeId: pos.storeId, guide: pos.guide, memberId: pos.memberId, amount, pay: pos.pay, time: "2026-07-05 14:20" },
      ...rows
    ]);
    pushToast(`销售单 ${serial("SD")} 提交成功，库存已更新（演示）`);
  };

  const createStocktake = () => {
    const storeId = pos.storeId || "s2";
    const rows = skus.slice(0, 5).map((sku, index) => {
      const book = stock[sku.id]?.[storeId] ?? 0;
      return { skuId: sku.id, book, counted: index === 0 ? book + 2 : index === 1 ? book - 2 : book - 1 };
    });
    const next: Stocktake = { id: serial("ST"), storeId, status: "草稿", createdAt: "2026/7/5 13:53:48", rows };
    setStocktakes((items) => [next, ...items]);
    setActiveStocktake(next);
  };

  const commitStocktake = (sheet: Stocktake) => {
    sheet.rows.forEach((row) => {
      setStock((prev) => ({
        ...prev,
        [row.skuId]: { ...(prev[row.skuId] ?? {}), [sheet.storeId]: row.counted }
      }));
    });
    setStocktakes((items) => items.map((item) => item.id === sheet.id ? { ...item, status: "已完成" } : item));
    setActiveStocktake({ ...sheet, status: "已完成" });
    pushToast(`盘点单 ${sheet.id} 已提交，库存已按实盘数调整（演示）`);
  };

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <div className="ops-logo">蜘蛛王中台</div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={page === item.id ? "ops-nav active" : "ops-nav"} onClick={() => setPage(item.id)}>
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">N</div>
      </aside>

      <main className="ops-main">
        <header className="ops-header">
          <div>
            <strong>蜘蛛王多门店经营中台</strong>
            <span className="demo-badge">演示版</span>
          </div>
          <div className="ops-actions">
            <label>角色：</label>
            <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
              {["老板（全部权限）", "经理", "总店长", "店长", "导购"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </header>

        {toast && <div className="toast">● {toast}</div>}

        {page === "dashboard" && (
          <>
            <div className="stats-row">
              <Stat title="今日销售额" value={fmt(sales.reduce((sum, item) => sum + item.amount, 3594))} accent="blue" />
              <Stat title="当前库存数量" value={`${totalStock}`} accent="green" />
              <Stat title="库存成本金额" value={role === "老板（全部权限）" ? fmt(totalCost) : "权限隐藏"} accent="gold" />
              <Stat title="库存风险预警" value={`${negativeCount + 20} 项`} accent="red" />
            </div>
            <div className="grid-2">
              <Card title="门店库存概要">
                <table>
                  <thead><tr><th>门店</th><th>可售库存</th><th>库存成本</th><th>预警</th></tr></thead>
                  <tbody>
                    {stores.map((store) => {
                      const qty = skus.reduce((sum, sku) => sum + (stock[sku.id]?.[store.id] ?? 0), 0);
                      const cost = skus.reduce((sum, sku) => sum + Math.max(stock[sku.id]?.[store.id] ?? 0, 0) * sku.cost, 0);
                      return <tr key={store.id}><td>{store.name}</td><td>{qty}</td><td>{fmt(cost)}</td><td><Tag tone={qty < 20 ? "warn" : "ok"}>{qty < 20 ? "库存偏低" : "正常"}</Tag></td></tr>;
                    })}
                  </tbody>
                </table>
              </Card>
              <Card title="库存风险提醒">
                <ul className="risk-list">
                  <li><b>负库存</b><span>蜘蛛王二店 SPK-2601-BK-41 当前 -1</span></li>
                  <li><b>低库存</b><span>多款 39/40 码低于安全库存</span></li>
                  <li><b>长期未销售</b><span>AOL-M301 部分尺码需要关注</span></li>
                  <li><b>断码风险</b><span>蜘蛛王二店黑色 41 码建议调拨</span></li>
                </ul>
              </Card>
            </div>
            <Card title="最近销售">
              <SalesTable sales={sales} members={members} />
            </Card>
          </>
        )}

        {page === "products" && (
          <Card title="商品中心" action={<button className="primary" onClick={() => setShowSkuModal(true)}>+ 新增SKU</button>}>
            <ProductTable skus={visibleSkus} />
          </Card>
        )}

        {page === "inventory" && (
          <Card title="库存中心">
            <div className="filter-line">
              <label>品牌筛选：</label>
              <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                <option>全部品牌</option>
                <option>蜘蛛王</option>
                <option>邦赛</option>
                <option>澳伦</option>
              </select>
            </div>
            <InventoryMatrix skus={visibleSkus} stock={stock} />
          </Card>
        )}

        {page === "receiving" && (
          <>
            <Card title="新建入库单">
              <div className="form-stack">
                <label><span>* 目标门店</span><select value={receivingStore} onChange={(event) => setReceivingStore(event.target.value)}>{stores.map((store) => <option value={store.id} key={store.id}>{store.name}</option>)}</select></label>
                <div className="inline-form">
                  <select value={receivingSku} onChange={(event) => setReceivingSku(event.target.value)}>{skus.map((sku) => <option value={sku.id} key={sku.id}>{sku.sku}（{sku.brand} - {sku.color}/{sku.size}）</option>)}</select>
                  <input type="number" value={receivingQty} onChange={(event) => setReceivingQty(Number(event.target.value))} />
                  <button className="tiny">⊖</button>
                </div>
                <button className="ghost">+ 添加SKU</button>
                <button className="primary fit" onClick={submitReceipt}>确认入库</button>
              </div>
            </Card>
            <Card title="入库记录">
              <table><thead><tr><th>单号</th><th>门店</th><th>时间</th><th>SKU</th></tr></thead><tbody>
                {receipts.length === 0 ? <tr><td colSpan={4} className="empty">暂无入库记录，请在上面创建</td></tr> : receipts.map((item) => <tr key={item.id}><td>{item.id}</td><td>{storeName(item.storeId)}</td><td>{item.time}</td><td>{skuName(skus, item.skuId)} x {item.qty}</td></tr>)}
              </tbody></table>
            </Card>
          </>
        )}

        {page === "transfer" && (
          <Card title="门店调拨">
            <div className="empty-page">
              <h3>门店间断码调拨</h3>
              <p>视频版第一阶段保留调拨入口，可从库存中心发现负库存后发起调拨。</p>
              <button className="primary" onClick={() => { updateStock("sku3", "s5", -2); updateStock("sku3", "s2", 2); pushToast("已从澳伦总店调拨 2 双到蜘蛛王二店（演示）"); }}>演示：调拨 2 双到蜘蛛王二店</button>
            </div>
          </Card>
        )}

        {page === "pos" && (
          <>
            <Card title="门店收银">
              <div className="pos-grid">
                <div className="form-stack">
                  <div className="three-cols">
                    <label><span>* 门店</span><select value={pos.storeId} onChange={(event) => setPos({ ...pos, storeId: event.target.value })}><option value="">选择门店</option>{stores.map((store) => <option value={store.id} key={store.id}>{store.name}</option>)}</select></label>
                    <label><span>* 导购</span><select value={pos.guide} onChange={(event) => setPos({ ...pos, guide: event.target.value })}><option value="">选择导购</option><option>小美</option><option>小陈</option><option>小周</option></select></label>
                    <label><span>会员（可选）</span><select value={pos.memberId} onChange={(event) => setPos({ ...pos, memberId: event.target.value })}><option value="">选择会员</option>{members.map((m) => <option value={m.id} key={m.id}>{m.name}</option>)}</select></label>
                  </div>
                  <b>商品明细</b>
                  <div className="inline-form">
                    <select value={pos.skuId} onChange={(event) => setPos({ ...pos, skuId: event.target.value })}><option value="">选择SKU</option>{skus.map((sku) => <option value={sku.id} key={sku.id}>{sku.sku}</option>)}</select>
                    <input type="number" value={pos.qty} onChange={(event) => setPos({ ...pos, qty: Number(event.target.value) })} />
                    <input value={pos.skuId ? fmt((skus.find((sku) => sku.id === pos.skuId)?.retail ?? 0) * pos.qty) : "¥0"} readOnly />
                  </div>
                  <button className="ghost">+ 添加商品</button>
                </div>
                <div className="pay-panel">
                  <span>应收金额</span>
                  <strong>{fmt(pos.skuId ? (skus.find((sku) => sku.id === pos.skuId)?.retail ?? 0) * pos.qty : 0)}</strong>
                  <label>* 支付方式</label>
                  <div className="pay-tabs">
                    {["微信", "支付宝", "现金", "银行卡", "混合支付", "储值支付"].map((pay) => <button key={pay} className={pos.pay === pay ? "active" : ""} onClick={() => setPos({ ...pos, pay })}>{pay}</button>)}
                  </div>
                  <button className="primary block" onClick={submitSale}>提交销售单（{fmt(pos.skuId ? (skus.find((sku) => sku.id === pos.skuId)?.retail ?? 0) * pos.qty : 0)}）</button>
                </div>
              </div>
            </Card>
            <Card title="销售记录">
              <SalesTable sales={sales} members={members} />
            </Card>
          </>
        )}

        {page === "returns" && (
          <Card title="退换货">
            <div className="empty-page">
              <h3>退货可回可售库存，也可进入残次库存</h3>
              <button className="primary" onClick={() => { updateStock("sku3", "s1", 1); pushToast("退货已回可售库存 +1（演示）"); }}>演示退货回可售</button>
              <button className="ghost" onClick={() => pushToast("退货已进入残次库存（演示）")}>演示退货进残次</button>
            </div>
          </Card>
        )}

        {page === "stocktake" && (
          <Card title="门店盘点">
            <div className="filter-line">
              <label>* 盘点门店：</label>
              <select value={pos.storeId || "s2"} onChange={(event) => setPos({ ...pos, storeId: event.target.value })}>{stores.map((store) => <option value={store.id} key={store.id}>{store.name}</option>)}</select>
              <button className="primary" onClick={createStocktake}>+ 创建盘点单</button>
            </div>
            <table><thead><tr><th>单号</th><th>门店</th><th>状态</th><th>SKU数</th><th>创建时间</th><th>操作</th></tr></thead><tbody>
              {stocktakes.length === 0 ? <tr><td colSpan={6} className="empty">暂无盘点记录</td></tr> : stocktakes.map((item) => <tr key={item.id}><td>{item.id}</td><td>{storeName(item.storeId)}</td><td><Tag tone="ok">{item.status}</Tag></td><td>{item.rows.length}</td><td>{item.createdAt}</td><td><button className="link" onClick={() => setActiveStocktake(item)}>查看</button></td></tr>)}
            </tbody></table>
          </Card>
        )}

        {page === "members" && (
          <Card title="会员CRM">
            <table><thead><tr><th>会员</th><th>手机号</th><th>门店</th><th>导购</th><th>等级</th><th>积分</th><th>储值</th></tr></thead><tbody>
              {members.map((m) => <tr key={m.id}><td>{m.name}</td><td>{m.phone}</td><td>{storeName(m.storeId)}</td><td>{m.guide}</td><td>{m.level}</td><td>{m.points}</td><td>{fmt(m.balance)}</td></tr>)}
            </tbody></table>
          </Card>
        )}

        {page === "analytics" && (
          <Card title="分析预警">
            <div className="stats-row small">
              <Stat title="负库存SKU" value={`${negativeCount}`} accent="red" />
              <Stat title="低库存预警" value="12" accent="gold" />
              <Stat title="长期未销售" value="6" accent="blue" />
              <Stat title="AI调拨建议" value="预留入口" accent="green" />
            </div>
            <InventoryMatrix skus={visibleSkus.filter((sku) => Object.values(stock[sku.id] ?? {}).some((qty) => qty <= 2))} stock={stock} />
          </Card>
        )}

        {page === "settings" && (
          <Card title="系统设置">
            <div className="settings-grid">
              <section><h3>门店</h3>{stores.map((store) => <p key={store.id}>{store.name} / {store.brand}</p>)}</section>
              <section><h3>权限</h3><p>老板：全部权限</p><p>经理/总店长：多店管理</p><p>店长/导购：本店数据</p></section>
              <section><h3>后续扩展</h3><p>审批流、条码、图片、AI分析、数据库持久化</p></section>
            </div>
          </Card>
        )}
      </main>

      {showSkuModal && (
        <div className="modal-mask">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowSkuModal(false)}>×</button>
            <h3>新增 SKU</h3>
            <label><span>* 品牌</span><select value={skuForm.brand} onChange={(event) => setSkuForm({ ...skuForm, brand: event.target.value })}><option>蜘蛛王</option><option>邦赛</option><option>澳伦</option></select></label>
            <label><span>* 货号</span><input value={skuForm.articleNo} onChange={(event) => setSkuForm({ ...skuForm, articleNo: event.target.value })} placeholder="例如 123113" /></label>
            <div className="three-cols">
              <label><span>* 颜色</span><input value={skuForm.color} onChange={(event) => setSkuForm({ ...skuForm, color: event.target.value })} placeholder="例如 黑色" /></label>
              <label><span>* 尺码</span><input value={skuForm.size} onChange={(event) => setSkuForm({ ...skuForm, size: event.target.value })} placeholder="例如 40" /></label>
              <label><span>* SKU码</span><input value={skuForm.sku} onChange={(event) => setSkuForm({ ...skuForm, sku: event.target.value })} /></label>
            </div>
            <div className="three-cols">
              <label><span>吊牌价</span><input defaultValue="¥" /></label>
              <label><span>成本价</span><input value={skuForm.cost} onChange={(event) => setSkuForm({ ...skuForm, cost: event.target.value })} placeholder="¥" /></label>
              <label><span>零售价</span><input value={skuForm.retail} onChange={(event) => setSkuForm({ ...skuForm, retail: event.target.value })} placeholder="¥" /></label>
            </div>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setShowSkuModal(false)}>Cancel</button>
              <button className="primary" onClick={addSku}>OK</button>
            </div>
          </div>
        </div>
      )}

      {activeStocktake && (
        <div className="modal-mask">
          <div className="modal wide">
            <button className="modal-close" onClick={() => setActiveStocktake(null)}>×</button>
            <h3>盘点详情 - {activeStocktake.id}</h3>
            <p>门店：{storeName(activeStocktake.storeId)}　状态：<Tag tone="ok">{activeStocktake.status}</Tag></p>
            <table><thead><tr><th>SKU</th><th>账面数</th><th>实盘数</th><th>差异</th></tr></thead><tbody>
              {activeStocktake.rows.map((row) => {
                const diff = row.counted - row.book;
                return <tr key={row.skuId}><td>{skuName(skus, row.skuId)}</td><td>{row.book}</td><td>{row.counted}</td><td className={diff < 0 ? "red" : diff > 0 ? "green" : ""}>{diff > 0 ? `+${diff}` : diff}</td></tr>;
              })}
            </tbody></table>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setActiveStocktake(null)}>关闭</button>
              {activeStocktake.status === "草稿" && <button className="primary" onClick={() => commitStocktake(activeStocktake)}>提交盘点</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="card"><div className="card-title"><h2>{title}</h2>{action}</div>{children}</section>;
}

function Stat({ title, value, accent }: { title: string; value: string; accent: string }) {
  return <div className={`stat ${accent}`}><span>{title}</span><strong>{value}</strong></div>;
}

function Tag({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "warn" | "bad" }) {
  return <span className={`tag ${tone}`}>{children}</span>;
}

function ProductTable({ skus }: { skus: Sku[] }) {
  return (
    <table>
      <thead><tr><th>SKU码</th><th>品牌</th><th>货号</th><th>颜色</th><th>尺码</th><th>成本价</th><th>零售价</th><th>状态</th><th>分类</th></tr></thead>
      <tbody>{skus.map((sku) => <tr key={sku.id}><td>{sku.sku}</td><td>{sku.brand}</td><td>{sku.articleNo}</td><td>{sku.color}</td><td>{sku.size}</td><td>¥{sku.cost}</td><td>¥{sku.retail}</td><td><Tag>{sku.status}</Tag></td><td>{sku.category}</td></tr>)}</tbody>
    </table>
  );
}

function InventoryMatrix({ skus, stock }: { skus: Sku[]; stock: StockMap }) {
  return (
    <table>
      <thead><tr><th>SKU</th><th>品牌</th><th>货号</th><th>颜色</th><th>尺码</th>{stores.map((store) => <th key={store.id}>{store.name}</th>)}</tr></thead>
      <tbody>
        {skus.map((sku) => <tr key={sku.id}><td>{sku.sku}</td><td>{sku.brand}</td><td>{sku.articleNo}</td><td>{sku.color}</td><td>{sku.size}</td>{stores.map((store) => {
          const qty = stock[sku.id]?.[store.id];
          return <td key={store.id} className={qty && qty < 0 ? "stock bad" : qty && qty <= 2 ? "stock warn" : qty && qty >= 6 ? "stock ok" : ""}>{qty ?? "-"}</td>;
        })}</tr>)}
      </tbody>
    </table>
  );
}

function SalesTable({ sales, members }: { sales: SaleOrder[]; members: Member[] }) {
  return (
    <table>
      <thead><tr><th>单号</th><th>门店</th><th>导购</th><th>会员</th><th>金额</th><th>支付</th><th>时间</th></tr></thead>
      <tbody>
        {sales.length === 0 ? <tr><td colSpan={7} className="empty">暂无销售记录</td></tr> : sales.map((sale) => <tr key={sale.id}><td>{sale.id}</td><td>{storeName(sale.storeId)}</td><td>{sale.guide}</td><td>{members.find((m) => m.id === sale.memberId)?.name ?? "-"}</td><td>{fmt(sale.amount)}</td><td>{sale.pay}</td><td>{sale.time}</td></tr>)}
      </tbody>
    </table>
  );
}

function storeName(id: string) {
  return stores.find((store) => store.id === id)?.name ?? id;
}

function skuName(skus: Sku[], id: string) {
  return skus.find((sku) => sku.id === id)?.sku ?? id;
}
