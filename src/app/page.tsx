import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center gap-12 max-w-2xl w-full text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400">
            Okane
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your smart personal finance companion
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-xs">
          <Link
            href="/signin"
            className="flex-1 rounded-lg bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex-1 rounded-lg border border-blue-600 text-blue-600 px-6 py-3 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors dark:text-blue-400 dark:border-blue-400"
          >
            Sign Up
          </Link>
        </div>
      </main>
      <ThemeToggle />
    </div>
  );
}
