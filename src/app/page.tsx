import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
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
            className="flex-1 rounded-lg border border-blue-600 text-blue-600 px-6 py-3 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Track Expenses</h3>
            <p className="text-gray-600 dark:text-gray-300">Monitor your spending habits with ease</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Set Budgets</h3>
            <p className="text-gray-600 dark:text-gray-300">Create and manage your financial goals</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Smart Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">Get personalized financial recommendations</p>
          </div>
        </div>
      </main>
    </div>
  );
}
