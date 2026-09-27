'use client';
import Link from 'next/link';
import { useState } from 'react';
import { bugReport } from '@/lib/bug';
import type { ReproductionResult } from '@/lib/bug';

// ─── tiny local styles only this page needs ───────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--border2)',
  borderRadius: 7,
  background: '#fff',
  fontSize: 14,
  color: 'var(--text)',
  fontFamily: 'inherit',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--muted)',
  marginBottom: 5,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function BreakdownRow({ label, value, dim, fail, pass }: {
  label: string;
  value: string;
  dim?: boolean;
  fail?: boolean;
  pass?: boolean;
}) {
  const color = fail ? 'var(--red)' : pass ? 'var(--green)' : dim ? 'var(--muted)' : 'var(--text)';
  return (
    <div className="metric">
      <small>{label}</small>
      <strong style={{ color, fontSize: 15 }}>{value}</strong>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BugPage() {
  const [notebookQty, setNotebookQty] = useState('1');
  const [penQty,      setPenQty]      = useState('1');
  const [coupon,      setCoupon]      = useState('SAVE10');
  const [variant,     setVariant]     = useState<'original' | 'repaired'>('original');
  const [result,      setResult]      = useState<ReproductionResult | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch('/api/reproductions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant,
          notebookQuantity: Number(notebookQty),
          penQuantity:      Number(penQty),
          coupon,
        }),
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error ?? 'Server error.'); return; }
      setResult(j.data);
    } catch {
      setError('Network error — check the console.');
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bugreplay-${result.variant}-evidence.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="shell">

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-mark">BR</span>
          BugReplay
        </Link>
        <div className="nav-links">
          <Link href="/bugs">Issues</Link>
          <Link href="/bugs/BUG-001/verification">Verification →</Link>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="section">

        <div className="toolbar">
          <div>
            <div className="eyebrow">Northstar Demo / {bugReport.id}</div>
            <h1>{bugReport.title}</h1>
          </div>
          <span className="status">
            <span className="dot red" />
            {bugReport.severity} severity
          </span>
        </div>

        <div className="layout">

          {/* ── Left column ─────────────────────────────────── */}
          <div>
            <div className="card">
              <div className="eyebrow">Bug report</div>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 12 }}>
                {bugReport.description}
              </p>

              <div className="metric" style={{ marginTop: 16 }}>
                <small>Expected total</small>
                <strong>$45.00</strong>
              </div>
              <div className="metric">
                <small>Seeded original</small>
                <strong style={{ color: 'var(--red)' }}>$40.00</strong>
              </div>

              <h3 style={{ marginTop: 20 }}>Reproduction steps</h3>
              <div className="timeline">
                {bugReport.steps.map((s, i) => (
                  <div className="event" key={s}>
                    <div className="event-num">{i + 1}</div>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="eyebrow">Developer handoff</div>
              <p style={{ marginTop: 8 }}>
                Export this evidence, then open the repository in IBM Bob IDE to
                inspect the calculation and add the regression test.
              </p>
              <div style={{ marginTop: 14 }}>
                <button className="btn" onClick={download} disabled={!result}>
                  Export evidence JSON
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column ────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Checkout input panel */}
            <div className="card">
              <div className="eyebrow">Interactive checkout</div>
              <p style={{ marginTop: 8 }}>
                Adjust quantities and coupon, then run the calculation to see
                the bug in action.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <div>
                  <label style={labelStyle} htmlFor="notebook-qty">
                    Demo Notebook qty
                  </label>
                  <input
                    id="notebook-qty"
                    type="number"
                    min={1}
                    step={1}
                    value={notebookQty}
                    onChange={e => setNotebookQty(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>
                    $30.00 each
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="pen-qty">
                    Demo Pen Set qty
                  </label>
                  <input
                    id="pen-qty"
                    type="number"
                    min={1}
                    step={1}
                    value={penQty}
                    onChange={e => setPenQty(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>
                    $20.00 each
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={labelStyle} htmlFor="coupon">
                  Coupon code
                </label>
                <input
                  id="coupon"
                  type="text"
                  placeholder="e.g. SAVE10 (or leave blank)"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>
                  SAVE10 = 10% off · any other value = no discount
                </div>
              </div>

              {/* Variant selector */}
              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Code variant</label>
                <div className="actions">
                  <button
                    className={`btn${variant === 'original' ? ' primary' : ''}`}
                    onClick={() => setVariant('original')}
                  >
                    Original bug
                  </button>
                  <button
                    className={`btn${variant === 'repaired' ? ' primary' : ''}`}
                    onClick={() => setVariant('repaired')}
                  >
                    Repaired code
                  </button>
                </div>
              </div>

              <button
                className="btn amber"
                style={{ width: '100%', marginTop: 14 }}
                onClick={run}
                disabled={loading}
              >
                {loading ? 'Calculating…' : 'Calculate total →'}
              </button>

              {error && (
                <div className="alert error" style={{ marginTop: 12 }}>
                  {error}
                </div>
              )}
            </div>

            {/* Result breakdown */}
            {result && (
              <div className={`card result ${result.matchesExpected ? 'pass' : 'fail'}`}
                   style={{ border: `1px solid ${result.matchesExpected ? 'var(--green-bdr)' : 'var(--red-bdr)'}`,
                            background: result.matchesExpected ? 'var(--green-bg)' : 'var(--red-bg)',
                            padding: 20 }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className="eyebrow">Checkout breakdown</span>
                  <span className={`badge ${result.matchesExpected ? 'pass' : 'fail'}`}>
                    {result.matchesExpected ? '✓ Pass' : '✗ Bug reproduced'}
                  </span>
                </div>

                <BreakdownRow
                  label="Subtotal"
                  value={fmt(result.subtotalCents)}
                />
                {result.discountCents > 0 && (
                  <BreakdownRow
                    label={`Discount (${result.cart.coupon.toUpperCase()})`}
                    value={`−${fmt(result.discountCents)}`}
                    dim
                  />
                )}
                <BreakdownRow
                  label="Actual total (observed)"
                  value={fmt(result.observedTotalCents)}
                  fail={!result.matchesExpected}
                  pass={result.matchesExpected}
                />
                <BreakdownRow
                  label="Expected total"
                  value={fmt(result.expectedTotalCents)}
                />

                {!result.matchesExpected && (
                  <div className="alert error" style={{ marginTop: 12, fontSize: 13 }}>
                    Off by {fmt(Math.abs(result.expectedTotalCents - result.observedTotalCents))}
                    {' — '}SAVE10 was applied twice.
                  </div>
                )}

                <div className="metric" style={{ marginTop: 4 }}>
                  <small>Variant</small>
                  <span className="mono" style={{ fontSize: 12 }}>{result.variant}</span>
                </div>
                <div className="metric">
                  <small>Run ID</small>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--dim)' }}>
                    {result.runId?.slice(0, 16)}…
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <footer className="footer">
        <Link href="/bugs">← Issues</Link>
        <span>BugReplay / IBM Bob 2.0</span>
      </footer>

    </main>
  );
}
