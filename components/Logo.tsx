import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-xl md:text-2xl tracking-tight">
        Epicurios <span className="italic">Wine</span>
      </span>
      <span className="text-[0.55rem] uppercase tracking-[0.3em] mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
        Le Club · Vente Privée 2026
      </span>
    </Link>
  );
}
