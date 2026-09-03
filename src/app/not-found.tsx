import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="text-accent font-mono text-sm">$ cat missing.txt</p>
      <p className="text-ink mt-2 font-mono text-6xl font-bold">404</p>
      <h1 className="text-ink mt-4 text-xl font-semibold">That page doesn&rsquo;t exist</h1>
      <p className="text-ink-soft mt-2 max-w-md">
        The link is broken, or the page moved. Either way, the exit is back to home.
      </p>
      <Link
        href="/"
        className="bg-accent text-accent-ink hover:bg-accent-strong mt-8 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
