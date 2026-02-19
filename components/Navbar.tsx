import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#07142a] px-6 py-3 flex gap-6 text-sm">
      <Link href="/">CyberSatark</Link>
      <Link href="/learn">Learn</Link>
      <Link href="/examples">Examples</Link>
      <Link href="/check">Check</Link>
      <Link href="/quiz">Quiz</Link>
      <Link href="/resources">Resources</Link>
    </nav>
  );
}
