import Link from 'next/link';

export default function Home() {
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
          <Link href="/bugs/BUG-001/verification">Verification</Link>
          <span className="status">
            <span className="dot" />
            Synthetic demo
          </span>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="hero">

        <div className="hero-eyebrow">
          Evidence-first debugging · IBM Bob 2.0
        </div>

        <h1>
          Turn a vague bug into a{' '}
          <em>verified fix.</em>
        </h1>

        <p className="hero-sub">
          BugReplay gives developers a reproducible evidence trail from
          failure report to regression test. This prototype demonstrates
          a seeded checkout defect using fictional data.
        </p>

        <div className="hero-actions">
          <Link className="btn primary" href="/bugs/BUG-001">
            Explore BUG-001 →
          </Link>
          <Link className="btn" href="/bugs/BUG-001/verification">
            See verification
          </Link>
        </div>

        {/* Evidence summary card */}
        <div className="evidence-card">
          <div className="evidence-header">
            <span className="evidence-title">Evidence Summary</span>
            <span className="badge info">BUG-001</span>
          </div>

          <div className="evidence-body">
            <div className="evidence-row">
              <span className="evidence-label">Original output</span>
              <span className="evidence-val-fail">$40.00</span>
            </div>
            <div className="evidence-row">
              <span className="evidence-label">Expected output</span>
              <span className="evidence-val-pass">$45.00</span>
            </div>
            <div className="evidence-verified">
              <span className="evidence-verified-label">Evidence state</span>
              <span className="evidence-verified-val">✓ Verified path</span>
            </div>
          </div>

          <div className="evidence-footer">
            SAVE10 · coupon-double-discount · northstar-v1
          </div>
        </div>

      </section>

      {/* ── Step cards ──────────────────────────────────────── */}
      <section className="step-grid">

        <div className="step-card">
          <span className="step-num-badge report">01 / Report</span>
          <h3>Start with evidence</h3>
          <p>
            Follow a deterministic reproduction instead of guessing what
            the reporter meant.
          </p>
          <div className="step-meta">BUG-001 · High severity</div>
        </div>

        <div className="step-card">
          <span className="step-num-badge repair">02 / Repair</span>
          <h3>Work with Bob IDE</h3>
          <p>
            Inspect the calculation, make a focused repair, and add the
            regression assertion.
          </p>
          <div className="step-meta">
            subtotal − discount × 2 → subtotal − discount
          </div>
        </div>

        <div className="step-card">
          <span className="step-num-badge verify">03 / Verify</span>
          <h3>Prove the outcome</h3>
          <p>
            Compare genuine before-and-after test artifacts with full
            source provenance.
          </p>
          <div className="step-meta">
            1 failed → 3 passed · checkout.test.ts
          </div>
        </div>

      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="footer">
        <span>Northstar Demo · fictional data only</span>
        <span className="mono">build with purpose</span>
      </footer>

    </main>
  );
}
