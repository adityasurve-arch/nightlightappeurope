import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'chart.js/auto'
import data from '../data/quarterSummary.json'
import './QuarterDashboard.css'

const CITIES = ['Paris', 'Milan', 'Barcelona', 'Vienna', 'Lisbon']
const GOLD = '#C8A24B'

const VIEWS = [
  { id: 'equity', label: 'Brand equity by city' },
  { id: 'competitor', label: 'Vodka head-to-head' },
  { id: 'elasticity', label: 'Price elasticity · Absolut' },
  { id: 'cohort', label: 'Gen Z trade-up curve' },
  { id: 'city', label: 'Single-city drill-down' },
  { id: 'campaigns', label: 'Campaigns', gold: true },
]

function fmt(n) {
  return n.toLocaleString('en-US')
}

function chartConfigFor(view) {
  if (view === 'equity') {
    const eq = CITIES.map(c => data.brand_equity_by_city[c].absolut_share)
    const house = CITIES.map(c => data.brand_equity_by_city[c].house_share)
    return {
      type: 'bar',
      data: {
        labels: CITIES,
        datasets: [
          { label: 'Absolut', data: eq, backgroundColor: '#534AB7', borderRadius: 4 },
          { label: 'House vodka', data: house, backgroundColor: '#3A3A3F', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: {
          x: { stacked: true, max: 100, ticks: { color: '#9A9AA0', callback: v => v + '%' }, grid: { color: '#2A2A2E' } },
          y: { stacked: true, ticks: { color: '#F5F5F7' }, grid: { display: false } },
        },
        plugins: {
          legend: { labels: { color: '#9A9AA0' } },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x}%` } },
        },
      },
    }
  }
  if (view === 'competitor') {
    const cb = data.competitor_breakdown_by_city
    return {
      type: 'bar',
      data: {
        labels: CITIES,
        datasets: [
          { label: 'Absolut', data: CITIES.map(c => cb[c].Absolut), backgroundColor: '#534AB7', borderRadius: 4 },
          { label: 'Smirnoff (Diageo)', data: CITIES.map(c => cb[c].Smirnoff), backgroundColor: '#F5A623', borderRadius: 4 },
          { label: 'Grey Goose (Bacardi)', data: CITIES.map(c => cb[c]['Grey Goose']), backgroundColor: '#4A90E2', borderRadius: 4 },
          { label: 'House vodka', data: CITIES.map(c => cb[c]['House vodka']), backgroundColor: '#6E6E72', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { stacked: true, max: 100, ticks: { color: '#9A9AA0', callback: v => v + '%' }, grid: { color: '#2A2A2E' }, title: { display: true, text: 'Share of vodka orders at parity', color: '#9A9AA0' } },
          x: { stacked: true, ticks: { color: '#F5F5F7' }, grid: { display: false } },
        },
        plugins: {
          legend: { labels: { color: '#9A9AA0' } },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
        },
      },
    }
  }
  if (view === 'elasticity') {
    const labels = ['Discount (-8%)', 'Parity', 'Premium (+18%)']
    const shares = [
      data.price_elasticity.discount.absolut_share,
      data.price_elasticity.parity.absolut_share,
      data.price_elasticity.premium.absolut_share,
    ]
    return {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Absolut share', data: shares, backgroundColor: ['#1D9E75', '#534AB7', '#D9534F'], borderRadius: 4 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { max: 80, ticks: { color: '#9A9AA0', callback: v => v + '%' }, grid: { color: '#2A2A2E' }, title: { display: true, text: 'Share of vodka orders', color: '#9A9AA0' } },
          x: { ticks: { color: '#F5F5F7' }, grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    }
  }
  if (view === 'cohort') {
    const buckets = ['0-3mo', '3-6mo', '6-9mo', '9-12mo', '12mo+']
    const shares = buckets.map(b => data.cohort_curve[b].absolut_share)
    return {
      type: 'line',
      data: {
        labels: buckets,
        datasets: [{
          label: 'Absolut share', data: shares,
          borderColor: '#1D9E75', backgroundColor: 'rgba(29, 158, 117, 0.15)',
          fill: true, tension: 0.3, pointRadius: 6, pointBackgroundColor: '#1D9E75',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { min: 30, max: 60, ticks: { color: '#9A9AA0', callback: v => v + '%' }, grid: { color: '#2A2A2E' }, title: { display: true, text: '% choosing Absolut', color: '#9A9AA0' } },
          x: { ticks: { color: '#F5F5F7' }, grid: { display: false }, title: { display: true, text: 'Member tenure', color: '#9A9AA0' } },
        },
        plugins: { legend: { display: false } },
      },
    }
  }
  return null
}

function Insight({ children }) {
  return (
    <div className="qd-insight">
      <div className="qd-insight-label">What this tells you</div>
      {children}
    </div>
  )
}

function EquityView({ canvasRef }) {
  const sorted = CITIES.slice().sort((a, b) => data.brand_equity_by_city[b].absolut_share - data.brand_equity_by_city[a].absolut_share)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const gap = data.brand_equity_by_city[top].absolut_share - data.brand_equity_by_city[bottom].absolut_share
  return (
    <div className="qd-panel">
      <div className="qd-panel-title">Vodka brand share when prices are equal</div>
      <div className="qd-panel-sub">% of vodka orders going to Absolut when priced at parity with house vodka. Last 18 months of parity-week data, by city.</div>
      <div className="qd-chart-wrap"><canvas ref={canvasRef} /></div>
      <Insight>
        Absolut commands a strong brand premium in <strong>{top}</strong> ({data.brand_equity_by_city[top].absolut_share}%) and barely outperforms house vodka in <strong>{bottom}</strong> ({data.brand_equity_by_city[bottom].absolut_share}%). That's a {gap.toFixed(1)}-point gap between the strongest and weakest student markets — driven by brand familiarity, marketing investment, and local competitive intensity. Marketing budget allocation should follow opportunity, not market size.
      </Insight>
    </div>
  )
}

function CompetitorView({ canvasRef }) {
  const cb = data.competitor_breakdown_by_city
  const ncs = data.network_competitor_share
  const weakestCity = CITIES.slice().sort((a, b) => cb[a].Absolut - cb[b].Absolut)[0]
  const strongestCity = CITIES.slice().sort((a, b) => cb[b].Absolut - cb[a].Absolut)[0]
  const competitorInWeakest = cb[weakestCity].Smirnoff > cb[weakestCity]['Grey Goose'] ? 'Smirnoff' : 'Grey Goose'
  const competitorOwner = competitorInWeakest === 'Smirnoff' ? 'Diageo' : 'Bacardi'
  return (
    <div className="qd-panel">
      <div className="qd-panel-title">Vodka head-to-head: Brand competition at price parity</div>
      <div className="qd-panel-sub">Real revealed-behavior share of every vodka order in parity-price weeks. Absolut versus Diageo's Smirnoff, Bacardi's Grey Goose, and house vodka. By city.</div>
      <div className="qd-summary-row">
        <div className="qd-summary-card">
          <div className="qd-summary-card-brand">Absolut</div>
          <div className="qd-summary-card-val" style={{ color: '#534AB7' }}>{ncs.Absolut}%</div>
          <div className="qd-summary-card-owner">Partner</div>
        </div>
        <div className="qd-summary-card">
          <div className="qd-summary-card-brand">Smirnoff</div>
          <div className="qd-summary-card-val" style={{ color: '#F5A623' }}>{ncs.Smirnoff}%</div>
          <div className="qd-summary-card-owner">Diageo</div>
        </div>
        <div className="qd-summary-card">
          <div className="qd-summary-card-brand">Grey Goose</div>
          <div className="qd-summary-card-val" style={{ color: '#4A90E2' }}>{ncs['Grey Goose']}%</div>
          <div className="qd-summary-card-owner">Bacardi</div>
        </div>
        <div className="qd-summary-card">
          <div className="qd-summary-card-brand">House vodka</div>
          <div className="qd-summary-card-val" style={{ color: '#6E6E72' }}>{ncs['House vodka']}%</div>
          <div className="qd-summary-card-owner">Generic</div>
        </div>
      </div>
      <div className="qd-chart-wrap qd-tall"><canvas ref={canvasRef} /></div>
      <Insight>
        Absolut dominates in <strong>{strongestCity}</strong> ({cb[strongestCity].Absolut}%), but in <strong>{weakestCity}</strong> Absolut's share collapses to {cb[weakestCity].Absolut}% — and {competitorInWeakest} ({competitorOwner}) eats into the gap with {cb[weakestCity][competitorInWeakest]}%. This is the chart brands have been trying to build for years through retail data: which competitor brand is taking share, in which market, when prices are equal. Currently their pricing teams treat all five markets the same. The data says {weakestCity} needs a different strategy than {strongestCity}.
      </Insight>
    </div>
  )
}

function ElasticityView({ canvasRef }) {
  const shares = [
    data.price_elasticity.discount.absolut_share,
    data.price_elasticity.parity.absolut_share,
    data.price_elasticity.premium.absolut_share,
  ]
  return (
    <div className="qd-panel">
      <div className="qd-panel-title">Absolut share of vodka orders, by price level</div>
      <div className="qd-panel-sub">Network-wide. Each bar is real revealed-behavior data from price experiments run across all five cities over 18 months.</div>
      <div className="qd-chart-wrap"><canvas ref={canvasRef} /></div>
      <Insight>
        At parity with house vodka, {shares[1]}% of students choose Absolut. Drop the price 8% and that jumps to {shares[0]}%. Raise it 18% and it falls to {shares[2]}%. That's the actual demand curve — measured in real money decisions, not surveys. Implication: Current on-trade pricing for Absolut is probably above the optimal point. Sweet spot looks like parity-to-slight-premium (3-7% over house), capturing brand value without losing the price-sensitive student segment.
      </Insight>
    </div>
  )
}

function CohortView({ canvasRef }) {
  const buckets = ['0-3mo', '3-6mo', '6-9mo', '9-12mo', '12mo+']
  const shares = buckets.map(b => data.cohort_curve[b].absolut_share)
  const start = shares[0]
  const end = shares[shares.length - 1]
  const lift = end - start
  return (
    <div className="qd-panel">
      <div className="qd-panel-title">Absolut share among vodka drinkers, by member tenure</div>
      <div className="qd-panel-sub">Cohort analysis. The longer someone has been a member, the more likely they are to choose Absolut over cheaper alternatives. This is how premium brand habit forms.</div>
      <div className="qd-chart-wrap"><canvas ref={canvasRef} /></div>
      <Insight>
        New members (0-3 months) choose Absolut {start}% of the time. After 12+ months, that climbs to {end}% — a {lift.toFixed(1)}-point lift. The trade-up window is real and measurable. This is the data brands have been guessing at for years: when does an 18-year-old become a premium drinker, and how can marketing accelerate that transition? Now you can see it.
      </Insight>
    </div>
  )
}

function CityView({ city, setCity }) {
  const demo = data.demographics_by_city[city]
  const eq = data.brand_equity_by_city[city]
  const portfolio = data.portfolio_by_city[city]
  const topBrands = data.top_brands_by_city[city]
  return (
    <>
      <div className="qd-city-grid">
        {CITIES.map(c => (
          <div key={c} className={`qd-city-card ${c === city ? 'qd-selected' : ''}`} onClick={() => setCity(c)}>
            <div className="qd-city-name">{c}</div>
            <div className="qd-city-stat">{data.brand_equity_by_city[c].absolut_share}%</div>
            <div className="qd-city-stat-label">Absolut at parity</div>
          </div>
        ))}
      </div>
      <div className="qd-panel">
        <div className="qd-panel-title">{city} · venue snapshot</div>
        <div className="qd-panel-sub">{fmt(demo.total_members)} members · {demo.international_pct}% international · top universities: {demo.top_universities.slice(0, 3).map(u => u.university).join(', ')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 18 }}>
          <div>
            <div className="qd-label-tiny">Top 10 brands ordered</div>
            <table className="qd-table"><tbody>
              {topBrands.map(b => <tr key={b.brand}><td>{b.brand}</td><td>{fmt(b.drinks)}</td></tr>)}
            </tbody></table>
          </div>
          <div>
            <div className="qd-label-tiny">Demographics</div>
            <table className="qd-table"><tbody>
              <tr><td>Members</td><td>{fmt(demo.total_members)}</td></tr>
              <tr><td>International</td><td>{demo.international_pct}%</td></tr>
              <tr><td>Partner portfolio share</td><td>{portfolio.partner_share ?? portfolio.pernod_share}%</td></tr>
              <tr><td>Absolut at parity</td><td>{eq.absolut_share}%</td></tr>
              <tr><td>Total drinks logged</td><td>{fmt(portfolio.total_drinks)}</td></tr>
            </tbody></table>
            <div className="qd-label-tiny" style={{ marginTop: 18 }}>Top nationalities</div>
            <table className="qd-table"><tbody>
              {demo.top_nationalities.map(n => <tr key={n.nationality}><td>{n.nationality}</td><td>{n.pct}%</td></tr>)}
            </tbody></table>
          </div>
        </div>
      </div>
    </>
  )
}

function CampaignsView() {
  const GOLD_SOFT = 'rgba(200,162,75,0.1)'
  const GOLD_BORDER = 'rgba(200,162,75,0.3)'
  const campaign = {
    name: 'Cask No. 7 — Single Malt Discovery Evening',
    brand: 'The Malt Society',
    date: '3 July 2025 · 20:00',
    venue: 'Le Cercle, Paris 8e',
    status: 'Completed',
    billing: 'per-RSVP · €12',
    funnel: { matched: 214, notified: 214, rsvpd: 87, optedIn: 62, attended: 71 },
    gdprNote: 'No personal data shared with The Malt Society. Brand received aggregate metrics only.',
  }
  const f = campaign.funnel
  const rsvpRate = ((f.rsvpd / f.notified) * 100).toFixed(1)
  const optInRate = ((f.optedIn / f.rsvpd) * 100).toFixed(1)

  const funnelRows = [
    { label: 'Audience matched', val: f.matched, pct: 100 },
    { label: 'Notifications sent', val: f.notified, pct: 100 },
    { label: 'RSVPed', val: f.rsvpd, pct: ((f.rsvpd / f.matched) * 100).toFixed(0) },
    { label: 'Opted in (name share)', val: f.optedIn, pct: ((f.optedIn / f.matched) * 100).toFixed(0) },
    { label: 'Attended', val: f.attended, pct: ((f.attended / f.matched) * 100).toFixed(0) },
  ]
  const tierRows = [{ label: 'Silver', val: 148, pct: 69, color: '#8C9FD4' }, { label: 'Gold', val: 66, pct: 31, color: '#C4A93A' }]
  const ageRows = [{ label: '25–34', val: 127, pct: 59, color: GOLD }, { label: '35–44', val: 87, pct: 41, color: 'rgba(200,162,75,0.5)' }]

  return (
    <>
      <div className="qd-panel" style={{ borderColor: GOLD_BORDER, background: `linear-gradient(135deg, ${GOLD_SOFT}, var(--qd-bg-card))` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <div>
            <div className="qd-label-tiny" style={{ color: GOLD }}>Campaign · {campaign.brand}</div>
            <div className="qd-panel-title">{campaign.name}</div>
            <div className="qd-panel-sub" style={{ marginBottom: 0 }}>{campaign.date} · {campaign.venue}</div>
          </div>
          <span style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75', border: '1px solid rgba(29,158,117,0.3)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="qd-kpi-row" style={{ marginBottom: 20 }}>
        <div className="qd-kpi" style={{ borderColor: GOLD_BORDER }}>
          <div className="qd-kpi-label">Audience matched</div>
          <div className="qd-kpi-value" style={{ color: GOLD }}>{f.matched}</div>
          <div className="qd-kpi-sub">Silver + Gold · Whisky · 25–44 · Paris</div>
        </div>
        <div className="qd-kpi">
          <div className="qd-kpi-label">RSVP rate</div>
          <div className="qd-kpi-value">{rsvpRate}%</div>
          <div className="qd-kpi-sub">{f.rsvpd} of {f.notified} notified</div>
        </div>
        <div className="qd-kpi">
          <div className="qd-kpi-label">Guest list opt-ins</div>
          <div className="qd-kpi-value">{optInRate}%</div>
          <div className="qd-kpi-sub">{f.optedIn} guests shared their name</div>
        </div>
        <div className="qd-kpi" style={{ borderColor: 'rgba(29,158,117,0.3)' }}>
          <div className="qd-kpi-label">Revenue to Quarter</div>
          <div className="qd-kpi-value" style={{ color: '#1D9E75' }}>€{f.rsvpd * 12}</div>
          <div className="qd-kpi-sub">{campaign.billing}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="qd-panel" style={{ marginBottom: 0 }}>
          <div className="qd-panel-title">RSVP funnel</div>
          <div className="qd-panel-sub">From matched audience to door</div>
          {funnelRows.map((row, i) => (
            <div className="qd-bar-row" key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--qd-text-dim)' }}>{row.label}</span>
                <span style={{ color: 'var(--qd-text)', fontWeight: 500 }}>{row.val} <span style={{ color: 'var(--qd-text-mute)', fontWeight: 400 }}>({row.pct}%)</span></span>
              </div>
              <div className="qd-bar-track">
                <div className="qd-bar-fill" style={{ width: `${row.pct}%`, background: i < 2 ? GOLD : i === 2 ? '#534AB7' : i === 3 ? '#1D9E75' : '#8888A0' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="qd-panel" style={{ marginBottom: 0 }}>
          <div className="qd-panel-title">Audience breakdown</div>
          <div className="qd-panel-sub">Who was targeted (no individuals)</div>
          <div className="qd-label-tiny" style={{ marginBottom: 8 }}>By tier</div>
          {tierRows.map(r => (
            <div className="qd-mini-bar-row" key={r.label}>
              <span style={{ width: 42, color: 'var(--qd-text-dim)' }}>{r.label}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--qd-border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
              </div>
              <span style={{ color: 'var(--qd-text)', width: 28, textAlign: 'right' }}>{r.val}</span>
            </div>
          ))}
          <div className="qd-label-tiny" style={{ marginTop: 16, marginBottom: 8 }}>By age group</div>
          {ageRows.map(r => (
            <div className="qd-mini-bar-row" key={r.label}>
              <span style={{ width: 42, color: 'var(--qd-text-dim)' }}>{r.label}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--qd-border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
              </div>
              <span style={{ color: 'var(--qd-text)', width: 28, textAlign: 'right' }}>{r.val}</span>
            </div>
          ))}
          <div className="qd-label-tiny" style={{ marginTop: 16, marginBottom: 6 }}>Category filter applied</div>
          <div style={{ display: 'inline-block', background: 'rgba(200,162,75,0.12)', color: GOLD, border: `1px solid ${GOLD_BORDER}`, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>🥃 Whisky</div>
        </div>
      </div>

      <div className="qd-panel" style={{ borderColor: 'rgba(83,74,183,0.3)', background: 'rgba(83,74,183,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <div>
            <div className="qd-panel-title" style={{ fontSize: 13, marginBottom: 1 }}>GDPR data handling log</div>
            <div className="qd-panel-sub" style={{ marginBottom: 0 }}>Audit trail for this campaign</div>
          </div>
        </div>
        <table className="qd-table" style={{ fontSize: 12 }}><tbody>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Personal data shared with {campaign.brand}</td><td style={{ color: '#1D9E75', fontWeight: 500 }}>None</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Targeting performed by</td><td>Nightlight (internal only)</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Brand visibility of segment</td><td>Aggregate reach count only (214)</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Name opt-ins (user-initiated)</td><td>{f.optedIn} guests — consent captured at RSVP</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Lawful basis</td><td>Art. 6(1)(a) GDPR — explicit consent</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Data retention</td><td>RSVP records anonymised 24 months post-event</td></tr>
        </tbody></table>
        <Insight>
          {campaign.gdprNote} The {f.optedIn} opt-in names are held by Nightlight and used only for door check-in. They are not transferred to {campaign.brand}'s CRM without a separate, user-initiated action.
        </Insight>
      </div>

      <div className="qd-panel">
        <div className="qd-panel-title">Campaign billing summary</div>
        <div className="qd-panel-sub">Sent to {campaign.brand} post-event</div>
        <table className="qd-table" style={{ fontSize: 12 }}><tbody>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Billing model</td><td>{campaign.billing}</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Confirmed RSVPs</td><td>{f.rsvpd}</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)' }}>Unit rate</td><td>€12.00 per RSVP</td></tr>
          <tr><td style={{ color: 'var(--qd-text-dim)', fontWeight: 600 }}>Total invoiced</td><td style={{ color: '#1D9E75', fontWeight: 600 }}>€{(f.rsvpd * 12).toLocaleString()}</td></tr>
        </tbody></table>
      </div>
    </>
  )
}

export default function QuarterDashboard() {
  const navigate = useNavigate()
  const [view, setView] = useState('equity')
  const [city, setCity] = useState('Paris')
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    const config = chartConfigFor(view)
    if (config && canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current.getContext('2d'), config)
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [view])

  return (
    <div className="qd-root">
      <button className="qd-back" onClick={() => navigate('/profile')}>← Back to Nightlight</button>
      <header className="qd-header">
        <div className="qd-label-tiny" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#534AB7', color: 'white', fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>Q</span>
          Quarter · Network overview · week {data.metadata?.week ?? 19}, 2026
        </div>
        <h1 className="qd-h1">Quarter</h1>
        <div className="qd-subhead">5 cities · 25,000 members · 18 months of behavioral data</div>
      </header>

      <div className="qd-kpi-row">
        <div className="qd-kpi">
          <div className="qd-kpi-label">Total members</div>
          <div className="qd-kpi-value">{fmt(data.overview.total_members)}</div>
          <div className="qd-kpi-sub">{fmt(data.overview.active_members_last_30d)} active in last 30 days</div>
        </div>
        <div className="qd-kpi">
          <div className="qd-kpi-label">Drinks logged</div>
          <div className="qd-kpi-value">{fmt(data.overview.total_drinks)}</div>
          <div className="qd-kpi-sub">{fmt(data.overview.drinks_last_week)} in the last week</div>
        </div>
        <div className="qd-kpi">
          <div className="qd-kpi-label">Avg drinks · visit</div>
          <div className="qd-kpi-value">{data.overview.avg_drinks_per_visit}</div>
          <div className="qd-kpi-sub">across {fmt(data.overview.total_visits)} visits</div>
        </div>
        <div className="qd-kpi">
          <div className="qd-kpi-label">Partner portfolio share</div>
          <div className="qd-kpi-value">{data.overview.partner_share ?? data.overview.pernod_share}%</div>
          <div className="qd-kpi-sub">of all logged drinks</div>
        </div>
      </div>

      <div className="qd-nav">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`qd-nav-btn ${view === v.id ? 'qd-active' : ''} ${v.gold ? 'qd-gold' : ''}`}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'equity' && <EquityView canvasRef={canvasRef} />}
      {view === 'competitor' && <CompetitorView canvasRef={canvasRef} />}
      {view === 'elasticity' && <ElasticityView canvasRef={canvasRef} />}
      {view === 'cohort' && <CohortView canvasRef={canvasRef} />}
      {view === 'city' && <CityView city={city} setCity={setCity} />}
      {view === 'campaigns' && <CampaignsView />}

      <div className="qd-footer">
        Quarter is a behavioral data platform for alcohol brands. Data shown is simulated to demonstrate the depth of insight the live network surfaces — 25,000 members, 1.57M drinks, 18 months of history. The production system ingests real POS data via API in real time.
      </div>
    </div>
  )
}
