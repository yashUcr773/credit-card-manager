'use client';

import { CreditCard, CardNetwork } from '@/types';
import { useCards } from '@/context/CardContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2, CreditCard as CreditCardIcon, AlertCircle, Wifi } from 'lucide-react';

interface CreditCardDisplayProps {
  card: CreditCard;
  onEdit?: (card: CreditCard) => void;
  onDelete?: (card: CreditCard) => void;
  compact?: boolean;
}

const NetworkLogo = ({ network }: { network: CardNetwork }) => {
  const logos: Record<CardNetwork, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX',
    rupay: 'RuPay',
    discover: 'DISC',
    diners: 'DC',
    other: '•••',
  };

  return (
    <span className="text-sm font-bold tracking-wider opacity-90">{logos[network]}</span>
  );
};

export function CreditCardDisplay({ card, onEdit, onDelete, compact = false }: CreditCardDisplayProps) {
  const { settings } = useCards();
  const utilization = card.creditLimit > 0 ? (card.outstandingBalance / card.creditLimit) * 100 : 0;
  
  // Calculate days until due
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), card.dueDate);
  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUtilizationColor = (util: number) => {
    if (util < 30) return 'text-emerald-300';
    if (util < 70) return 'text-amber-300';
    return 'text-rose-300';
  };

  const getUtilizationBarColor = (util: number) => {
    if (util < 30) return 'bg-emerald-400';
    if (util < 70) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  if (compact) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl p-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        style={{ 
          background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <CreditCardIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{card.nickname}</p>
              <p className="text-sm opacity-80">{card.bank} •••• {card.lastFourDigits}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatCurrency(card.outstandingBalance)}</p>
            <p className="text-sm opacity-80">
              {daysUntilDue <= 3 && card.outstandingBalance > 0 ? (
                <span className="text-rose-200 flex items-center gap-1 justify-end">
                  <AlertCircle className="h-3 w-3" />
                  Due in {daysUntilDue}d
                </span>
              ) : (
                `Due: ${card.dueDate}${getOrdinalSuffix(card.dueDate)}`
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-2"
      style={{ 
        background: `linear-gradient(145deg, ${card.color}, ${card.color}bb)`,
      }}
    >
      {/* Card texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Chip pattern */}
      <div className="absolute top-6 left-6 w-12 h-9 rounded-lg bg-gradient-to-br from-amber-300/80 to-amber-400/60 shadow-inner">
        <div className="absolute inset-0.5 rounded-md bg-gradient-to-br from-amber-200/40 to-amber-300/20" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-400/50" />
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-amber-400/50" />
        <div className="absolute top-0 bottom-0 right-1/3 w-px bg-amber-400/50" />
      </div>
      
      {/* Contactless icon */}
      <div className="absolute top-8 left-20">
        <Wifi className="h-5 w-5 opacity-60 rotate-90" />
      </div>

      {/* Card Header */}
      <div className="relative flex items-start justify-between">
        <div className="pt-8">
          <p className="text-xl font-bold tracking-wide">{card.nickname}</p>
          <p className="text-sm opacity-80 font-medium">{card.bank}</p>
        </div>
        <div className="flex items-center gap-2">
          <NetworkLogo network={card.network} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit?.(card)} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Card
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(card)}
                className="text-destructive focus:text-destructive gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Number Display */}
      <div className="relative my-8">
        <p className="font-mono text-2xl tracking-[0.3em] font-medium">
          •••• •••• •••• {card.lastFourDigits}
        </p>
      </div>

      {/* Card Stats */}
      <div className="relative grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Outstanding</p>
          <p className="text-2xl font-bold">{formatCurrency(card.outstandingBalance)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Credit Limit</p>
          <p className="text-2xl font-bold">{formatCurrency(card.creditLimit)}</p>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="opacity-70 font-medium">Utilization</span>
          <span className={cn('font-bold', getUtilizationColor(utilization))}>
            {utilization.toFixed(1)}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              getUtilizationBarColor(utilization)
            )}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {card.emis.length > 0 && (
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm">
              {card.emis.length} EMI{card.emis.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {daysUntilDue <= 3 && card.outstandingBalance > 0 && (
            <AlertCircle className="h-4 w-4 text-rose-300 animate-pulse" />
          )}
          <span className={cn(
            'font-medium',
            daysUntilDue <= 3 && card.outstandingBalance > 0 ? 'text-rose-200' : 'opacity-80'
          )}>
            Due: {card.dueDate}{getOrdinalSuffix(card.dueDate)} ({daysUntilDue}d)
          </span>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
