import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'BugReplay | Evidence-first debugging', description: 'Turn vague bugs into verified fixes.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
