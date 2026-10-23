import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ScanLine } from "lucide-react";
import "./globals.css";
export const metadata: Metadata = {
  title: "ProfEmail — Resume Lab & Research Outreach",
  description:
    "Private, browser-local CV feedback with transparent checks, plus a separate PhD outreach workspace.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <ScanLine size={21} />
            </span>
            ProfEmail
            <span className="brand-divider" />
            <span className="brand-subtitle">career & research</span>
          </Link>
          <div className="nav-links">
            <Link href="/resume-checker">Resume Lab</Link>
            <Link href="/methodology">Our approach</Link>
            <Link href="/dashboard" className="nav-outreach">
              PhD outreach <ArrowUpRight size={14} />
            </Link>
          </div>
        </nav>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
