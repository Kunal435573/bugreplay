import Link from 'next/link';

export default function BugsPage() {
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
            <div className="eyebrow">Northstar Demo</div>
            <h1>Bug reports</h1>
          </div>
          <span className="status">
            <span className="dot" />
            1 open issue
          </span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge info">BUG-001</span>
                <span className="badge fail">High severity</span>
              </div>
              <h3 style={{ marginTop: 4 }}>SAVE10 is applied twice at checkout</h3>
              <p style={{ marginTop: 2 }}>
                The SAVE10 coupon discount is subtracted twice, causing customers
                to be undercharged by $5.00 on a $50.00 order.
              </p>
            </div>
            <Link className="btn primary" href="/bugs/BUG-001" style={{ flexShrink: 0 }}>
              View BUG-001 →
            </Link>
          </div>

          <div className="step-meta" style={{ marginTop: 16, paddingTop: 14 }}>
            SAVE10 · coupon-double-discount · northstar-v1
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
