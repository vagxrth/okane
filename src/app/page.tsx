import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Coins, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 dark:from-slate-950 dark:to-slate-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Japanese Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] pointer-events-none"></div>
      
      <div className="relative z-10 text-center px-4">
        {/* Logo Icon */}
        <div className="mb-8 inline-block">
          <div className="relative">
            <Coins className="w-16 h-16 text-primary animate-pulse" />
            <Wallet className="w-8 h-8 text-primary/80 absolute -bottom-2 -right-2" />
          </div>
        </div>

        {/* Main Heading (Japanese) */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-japanese">
          お金
        </h1>
        
        {/* English Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6">
          Your Smart Financial Management Companion
        </p>
        
        {/* English Description */}
        <p className="text-sm text-muted-foreground/80 mb-8">
          Easy expense tracking, budget management, and financial analysis
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signin">
            <Button
              size="lg"
              className="min-w-[160px] bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[160px] border-primary/20 hover:bg-primary/5"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
}
