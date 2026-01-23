'use client';

import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  TrendingUp,
  Calendar,
  AlertCircle,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardStats() {
  const { cards, settings, getDashboardStats, isLoading } = useCards();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-6">
              <div className="h-4 w-24 rounded-lg bg-muted animate-pulse" />
              <div className="mt-4 h-8 w-32 rounded-lg bg-muted animate-pulse" />
              <div className="mt-2 h-3 w-20 rounded-lg bg-muted animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const stats = getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUtilizationColor = (util: number) => {
    if (util < 30) return 'text-emerald-600 dark:text-emerald-400';
    if (util < 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getUtilizationBg = (util: number) => {
    if (util < 30) return 'from-emerald-500 to-emerald-600';
    if (util < 70) return 'from-amber-500 to-amber-600';
    return 'from-rose-500 to-rose-600';
  };

  const statCards = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(stats.totalOutstanding),
      subtitle: `Across ${cards.length} card${cards.length !== 1 ? 's' : ''}`,
      icon: Wallet,
      iconBg: 'from-violet-500 to-purple-600',
      trend: stats.totalOutstanding > 0 ? 'up' : null,
    },
    {
      title: 'Credit Utilization',
      value: `${stats.totalUtilization.toFixed(1)}%`,
      subtitle: `${formatCurrency(stats.totalOutstanding)} of ${formatCurrency(stats.totalCreditLimit)}`,
      icon: TrendingUp,
      iconBg: getUtilizationBg(stats.totalUtilization),
      valueClass: getUtilizationColor(stats.totalUtilization),
      showProgress: true,
      progressValue: Math.min(stats.totalUtilization, 100),
    },
    {
      title: 'Available Credit',
      value: formatCurrency(stats.totalCreditLimit - stats.totalOutstanding),
      subtitle: `of ${formatCurrency(stats.totalCreditLimit)} total limit`,
      icon: PiggyBank,
      iconBg: 'from-emerald-500 to-teal-600',
      trend: 'down',
    },
    {
      title: 'Monthly EMI',
      value: formatCurrency(stats.totalEMIAmount),
      subtitle: `${cards.reduce((sum, c) => sum + c.emis.length, 0)} active EMI${cards.reduce((sum, c) => sum + c.emis.length, 0) !== 1 ? 's' : ''}`,
      icon: CreditCard,
      iconBg: 'from-blue-500 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 bg-card shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className={cn('text-2xl font-bold tracking-tight', stat.valueClass)}>
                    {stat.value}
                  </p>
                  {stat.showProgress && (
                    <div className="pt-1">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', stat.iconBg)}
                          style={{ width: `${stat.progressValue}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg',
                  stat.iconBg
                )}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Dues */}
      {stats.upcomingDues.length > 0 && (
        <Card className="border-0 bg-card shadow-lg shadow-black/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <span>Upcoming Due Dates</span>
                <p className="text-sm font-normal text-muted-foreground mt-0.5">
                  Your next payment deadlines
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.upcomingDues.slice(0, 5).map(({ card, daysUntilDue, dueDate }) => (
                <div
                  key={card.id}
                  className="group flex items-center justify-between rounded-2xl border border-border/50 bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/50 hover:border-border"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)` 
                      }}
                    >
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{card.nickname}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.bank} •••• {card.lastFourDigits}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(card.outstandingBalance)}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      {daysUntilDue <= 3 && card.outstandingBalance > 0 && (
                        <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                      )}
                      <Badge
                        variant={
                          daysUntilDue <= 3 && card.outstandingBalance > 0
                            ? 'destructive'
                            : daysUntilDue <= 7
                            ? 'secondary'
                            : 'outline'
                        }
                        className={cn(
                          'font-medium',
                          daysUntilDue <= 3 && card.outstandingBalance > 0 && 'animate-pulse'
                        )}
                      >
                        {daysUntilDue === 0
                          ? '🔥 Due today'
                          : daysUntilDue === 1
                          ? '⚡ Due tomorrow'
                          : `${daysUntilDue} days`}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
