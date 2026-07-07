import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
          Introducing QuickTask SaaS
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Organize your workflow with{' '}
          <span className="text-primary">Kanban Perfection</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-lg mx-auto">
          A minimalist task manager to keep your performance high. Upgrade anytime to unlock unlimited limits.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-xl bg-primary px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-hover shadow-lg shadow-primary/20"
          >
            Get Started (Free)
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-surface border border-border-muted px-8 py-3.5 font-semibold text-zinc-200 transition-colors hover:bg-surface-hover"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}