'use client';

import { EMIManager } from '@/components/emi/EMIManager';
import { Button } from '@/components/ui/button';
import { IndianRupee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EMIsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center gap-4 px-4 lg:px-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
              <IndianRupee className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">EMI Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative px-4 py-8 lg:px-8">
        <EMIManager />
      </main>
    </div>
  );
}
