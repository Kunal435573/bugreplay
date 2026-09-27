'use client';
import Link from 'next/link';
import { useState } from 'react';
import { bugReport } from '@/lib/bug';

export default function BugPage() {
  const [variant, setVariant] = useState<'original' | 'repaired'>('original');
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    const r = await fetch('/api/reproductions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variant }),
    });
    const j = await r.json();
    setResult(j.data);
    setLoading(false);
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
          <div>
            <div className="card">
              <div className="eyebrow">Reproduce scenario</div>
              <p style={{ marginTop: 8 }}>
                Choose a labeled implementation variant. The calculation runs
                server-side against the seeded fixture.
              </p>

              <div className="actions" style={{ marginTop: 14 }}>
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

              <button
                className="btn primary"
                style={{ width: '100%', marginTop: 12 }}
                onClick={run}
                disabled={loading}
              >
                {loading ? 'Running…' : 'Run reproduction →'}
              </button>

              {result && (
                <div className={`result ${result.matchesExpected ? 'pass' : 'fail'}`}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span className="eyebrow">Result</span>
                    <span className={`badge ${result.matchesExpected ? 'pass' : 'fail'}`}>
                      {result.matchesExpected ? '✓ Pass' : '✗ Fail'}
                    </span>
                  </div>
                  <div className="metric">
                    <small>Observed total</small>
                    <strong
                      style={{ color: result.matchesExpected ? 'var(--green)' : 'var(--red)' }}
                    >
                      ${(result.observedTotalCents / 100).toFixed(2)}
                    </strong>
                  </div>
                  <div className="metric">
                    <small>Expected total</small>
                    <strong>${(result.expectedTotalCents / 100).toFixed(2)}</strong>
                  </div>
                  <div className="metric">
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

        </div>
      </section>

      <footer className="footer">
        <Link href="/">← Home</Link>
        <span>BugReplay / IBM Bob 2.0</span>
      </footer>

    </main>
  );
}
