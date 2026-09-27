import Link from 'next/link';
import { verification } from '@/lib/verification';

export default function VerificationPage() {
  return (
    <main className="shell">

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="nav">
        <Link className="brand" href="/">
          <span className="brand-mark">BR</span>
          BugReplay
        </Link>
        <div className="nav-links">
          <Link href="/bugs/BUG-001">← Report</Link>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="section">

        <div className="eyebrow" style={{ marginBottom: 6 }}>
          BUG-001 / recorded verification
        </div>

        <div className="toolbar">
          <h1>Did the fix hold?</h1>
          <span className="status">
            <span className="dot" />
            Comparison ready
          </span>
        </div>

        <div className="alert success">
          The same regression expectation was evaluated before and after the
          repair. The original source fails at $40; the repaired source passes
          at $45.
        </div>

        <div className="compare" style={{ marginTop: 16 }}>
          <Run title="Before · seeded defect" run={verification.before} fail />
          <Run title="After · Bob fix"        run={verification.after} />
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="eyebrow">Source diff</div>
          <p style={{ marginTop: 8 }}>
            The repair removes the duplicate discount subtraction while keeping
            the expected total assertion unchanged.
          </p>
          <pre className="code">{`- return subtotal - discount * 2\n+ return subtotal - discount\n\n✓ calculateTotal(5000, SAVE10) === 4500`}</pre>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="eyebrow">Provenance</div>
          <div className="metric">
            <small>Fixture identity</small>
            <span className="mono">northstar-v1</span>
          </div>
          <div className="metric">
            <small>Regression command</small>
            <span className="mono">npm test -- checkout</span>
          </div>
          <div className="metric">
            <small>Evidence policy</small>
            <span className="muted">Recorded from genuine local test runs</span>
          </div>
        </div>

      </section>

      <footer className="footer">
        <Link href="/bugs/BUG-001">← Reproduce bug</Link>
        <span>BugReplay / IBM Bob 2.0</span>
      </footer>

    </main>
  );
}

function Run({
  title,
  run,
  fail,
}: {
  title: string;
  run: any;
  fail?: boolean;
}) {
  return (
    <div className={`run ${fail ? 'fail' : 'pass'}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="status" style={{ borderRadius: 6, padding: '4px 8px' }}>
          <span className={`dot${fail ? ' red' : ''}`} />
          {run.status}
        </span>
        <span className={`badge ${fail ? 'fail' : 'pass'}`}>
          {fail ? '✗ Failed' : '✓ Passed'}
        </span>
      </div>
      <h3>{title}</h3>
      <div className="metric">
        <small>Assertions</small>
        <strong>{run.passed} passed · {run.failed} failed</strong>
      </div>
      <div className="metric">
        <small>Duration</small>
        <span className="mono">{run.durationMs} ms</span>
      </div>
      <div className="metric">
        <small>Source revision</small>
        <span className="mono">{run.sourceRevision}</span>
      </div>
      <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>{run.message}</p>
    </div>
  );
}
