import { Bar, Stage, Text, Window, Row, Avatar } from '../../kit'
import '../../kit/zh.css'
import './card.css'

// static-card, rebuilt for a Chinese product (references/zh.md). Same 400 × 300
// feature card, same crop and satellite; what changes is the words and the
// type. lang="zh-CN" on the wrapper picks Simplified glyph forms; look-zh sets
// the system CJK fonts, one step more leading and density, no tracking.
// Labels are two characters, the names are plausible and unknown, the bars
// are hanzi-length (one character ≈ one font-size), figures stay Latin.

// Three real rows (the selected one and its neighbors), bars only on the
// rows the crop takes. Bars are sized for 4–5 hanzi names, not Latin words
const ROWS: { selected?: boolean; name?: number | string; amount?: number | string }[] = [
  { name: '远山科技', amount: '¥1,240' },
  { selected: true },
  { name: '拾光书店', amount: '¥860' },
  { name: 56, amount: 36 },
  { name: 44, amount: 44 },
  { name: 60, amount: 40 },
]
const NAV = ['概览', '客户', '发票', '报表']

export default function ZhCard() {
  return (
    <div lang="zh-CN">
      <Stage width={400} height={300} compact={{ below: 400, width: 358, height: 300 }} className="look-zh zc-card">
        {() => (
          <>
            <Window url="dashboard.yuanshan.co" className="zc-window">
              {/* The sidebar is what the detail card covers, so the rows stay readable */}
              <aside className="zc-sidebar">
                <Bar w={20} h={20} r={6} tone={4} style={{ marginBottom: 10 }} />
                {NAV.map((label, i) => (
                  // The active item is marked by weight, not a pill: a pill would peek out beside the detail card
                  <div key={i} className="zc-nav" data-on={i === 1 || undefined}>
                    <Bar w={10} h={10} r={3} tone={i === 1 ? 4 : 3} />
                    <Text className="zc-nav__label">{label}</Text>
                  </div>
                ))}
              </aside>
              <div className="zc-main">
                <div className="zc-header">
                  <Text className="zc-title">客户</Text>
                  <Bar w={44} h={22} r={6} tone={2} />
                </div>
                <div className="zc-list">
                  {ROWS.map((row, i) =>
                    row.selected ? (
                      <Row key={i} pad={0} selected className="zc-row" data-target="selected" lead={<Avatar name="青禾瑜伽" tone="accent" size={18} />} title={<Text className="zc-name">青禾瑜伽</Text>}>
                        <Bar w={40} tone={4} />
                      </Row>
                    ) : (
                      <Row key={i} pad={0} className="zc-row" lead={<Bar w={18} h={18} r={9} tone={2} />} title={typeof row.name === 'string' ? <Text className="zc-rowname">{row.name}</Text> : <Bar w={row.name!} tone={3} />}>
                        {typeof row.amount === 'string' ? <Text className="zc-rowamount">{row.amount}</Text> : <Bar w={row.amount!} tone={2} />}
                      </Row>
                    ),
                  )}
                </div>
              </div>
            </Window>

            <div className="zc-detail">
              <div className="zc-detail-head">
                <Avatar name="青禾瑜伽" tone="accent" size={26} className="zc-avatar-large" />
                <div className="zc-detail-who">
                  <Text className="zc-detail-name">青禾瑜伽</Text>
                  <Bar w={56} h={5} tone={2} />
                </div>
              </div>
              {[42, 30].map((w, i) => (
                <div key={i} className="zc-detail-row">
                  <Bar w={w} h={5} tone={3} />
                  <Bar w={w - 8} h={5} tone={2} />
                </div>
              ))}
              <div className="zc-detail-row total">
                <Text className="zc-detail-label">合计</Text>
                <Text className="zc-detail-total">¥72.00</Text>
              </div>
            </div>
          </>
        )}
      </Stage>
    </div>
  )
}
