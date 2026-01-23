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
  DollarSign,
  PiggyBank,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardStats() {
  const { cards, settings, getDashboardStats, isLoading } = useCards();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 rounded bg-muted" />
            </CardContent>
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
    if (util < 30) return 'text-green-500';
    if (util < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getUtilizationBg = (util: number) => {
    if (util < 30) return 'bg-green-500';
    if (util < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Outstanding */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              Across {cards.length} card{cards.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Credit Utilization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credit Utilization
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', getUtilizationColor(stats.totalUtilization))}>
              {stats.totalUtilization.toFixed(1)}%
            </div>
            <Progress
              value={Math.min(stats.totalUtilization, 100)}
              className="mt-2 h-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(stats.totalOutstanding)} of {formatCurrency(stats.totalCreditLimit)}
            </p>
          </CardContent>
        </Card>

        {/* Total Credit Limit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Credit
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCreditLimit - stats.totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(stats.totalCreditLimit)} total limit
            </p>
          </CardContent>
        </Card>

        {/* Active EMIs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly EMI
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEMIAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {cards.reduce((sum, c) => sum + c.emis.length, 0)} active EMI
              {cards.reduce((sum, c) => sum + c.emis.length, 0) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Dues */}
      {stats.upcomingDues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Upcoming Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.upcomingDues.slice(0, 5).map(({ card, daysUntilDue, dueDate }) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: card.color }}
                    >
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{card.nickname}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.bank} •••• {card.lastFourDigits}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(card.outstandingBalance)}</p>
                    <div className="flex items-center justify-end gap-2">
                      {daysUntilDue <= 3 && card.outstandingBalance > 0 && (
                        <AlertCircle className="h-3 w-3 text-destructive" />
                      )}
                      <Badge
                        variant={
                          daysUntilDue <= 3 && card.outstandingBalance > 0
                            ? 'destructive'
                            : daysUntilDue <= 7
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {daysUntilDue === 0
                          ? 'Due today'
                          : daysUntilDue === 1
                          ? 'Due tomorrow'
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
