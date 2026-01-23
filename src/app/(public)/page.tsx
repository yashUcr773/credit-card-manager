'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Shield,
  Lock,
  Smartphone,
  TrendingUp,
  Bell,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All your data stays on your device. No servers, no tracking, no data collection.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Lock,
      title: 'Secure by Design',
      description: 'We never store full card numbers, CVV, or sensitive banking information.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Track Utilization',
      description: 'Monitor your credit utilization across all cards to maintain a healthy credit score.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Bell,
      title: 'Never Miss a Payment',
      description: 'Set reminders for due dates and get notified before payments are due.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Smartphone,
      title: 'Works Offline',
      description: 'Access your card information anytime, even without an internet connection.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: CreditCard,
      title: 'EMI Tracking',
      description: 'Keep track of all your EMIs and installment payments in one place.',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const benefits = [
    'No bank account linking required',
    'No cloud sync - 100% offline capable',
    'No advertisements or data selling',
    'Open source and transparent',
    'Works on any modern browser',
    'Free forever',
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Credit Card Manager</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="rounded-xl">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl shadow-lg shadow-primary/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container px-4 pt-20 pb-16 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Privacy-first credit card management</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Track Your Credit Cards{' '}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Securely & Privately
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A privacy-first app to manage multiple credit cards, track spending,
            monitor EMIs, and never miss a payment. All data stays on your device.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 gap-2 text-base px-8">
                Start Tracking Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-xl gap-2 text-base px-8">
                I Already Have an Account
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>No Data Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-emerald-500" />
              <span>Works Offline</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Card Preview */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 shadow-2xl shadow-violet-500/20">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-black/20" />
            <div className="relative grid gap-6 sm:grid-cols-2">
              {/* Sample Card 1 */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-sm font-medium">HDFC Regalia</span>
                  <span className="text-xs opacity-70">VISA</span>
                </div>
                <p className="mt-4 font-mono text-white tracking-wider">•••• •••• •••• 4532</p>
                <div className="mt-4 flex justify-between text-white">
                  <div>
                    <p className="text-xs opacity-70">Outstanding</p>
                    <p className="font-semibold">₹45,230</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70">Due Date</p>
                    <p className="font-semibold">15th</p>
                  </div>
                </div>
              </div>

              {/* Sample Card 2 */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-sm font-medium">ICICI Amazon Pay</span>
                  <span className="text-xs opacity-70">MC</span>
                </div>
                <p className="mt-4 font-mono text-white tracking-wider">•••• •••• •••• 8901</p>
                <div className="mt-4 flex justify-between text-white">
                  <div>
                    <p className="text-xs opacity-70">Outstanding</p>
                    <p className="font-semibold">₹12,800</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70">Due Date</p>
                    <p className="font-semibold">20th</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-6 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <div className="flex items-center justify-between text-white">
                <div className="text-center">
                  <p className="text-2xl font-bold">₹58,030</p>
                  <p className="text-xs opacity-70">Total Outstanding</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">23%</p>
                  <p className="text-xs opacity-70">Utilization</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs opacity-70">Active Cards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Manage Your Cards
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features designed with your privacy in mind
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative container px-4 py-16 lg:px-8 lg:py-24">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Your Privacy is Our Priority
              </h2>
              <p className="mt-4 text-muted-foreground">
                Unlike other apps that require bank login or sync your data to clouds,
                Credit Card Manager keeps everything on your device. You&apos;re in complete control.
              </p>
              <ul className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 gap-2">
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl">
                  <Shield className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Take Control?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start managing your credit cards the private way. No signup fees, no hidden costs.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 gap-2 text-base px-8">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container px-4 py-8 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-semibold">Credit Card Manager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Credit Card Manager. Privacy-first, always.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
