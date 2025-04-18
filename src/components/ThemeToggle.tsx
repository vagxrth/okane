'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering icons until mounted
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20 w-9 h-9" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20">
          <Sun className={`h-[1.2rem] w-[1.2rem] transition-opacity ${theme === 'light' ? 'opacity-100' : 'opacity-0'} absolute`} />
          <Moon className={`h-[1.2rem] w-[1.2rem] transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'} absolute`} />
          <Laptop className={`h-[1.2rem] w-[1.2rem] transition-opacity ${theme === 'system' ? 'opacity-100' : 'opacity-0'} absolute`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}