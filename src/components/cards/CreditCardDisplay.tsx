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
import { MoreVertical, Pencil, Trash2, CreditCard as CreditCardIcon, AlertCircle } from 'lucide-react';

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
    <span className="text-xs font-bold tracking-wider opacity-80">{logos[network]}</span>
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
    if (util < 30) return 'text-green-400';
    if (util < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (compact) {
    return (
      <div
        className="relative rounded-lg p-4 text-white shadow-lg"
        style={{ backgroundColor: card.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCardIcon className="h-5 w-5 opacity-70" />
            <div>
              <p className="font-medium">{card.nickname}</p>
              <p className="text-xs opacity-70">{card.bank} •••• {card.lastFourDigits}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(card.outstandingBalance)}</p>
            <p className="text-xs opacity-70">
              {daysUntilDue <= 3 && card.outstandingBalance > 0 ? (
                <span className="text-red-300 flex items-center gap-1">
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
      className="relative rounded-xl p-5 text-white shadow-xl transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: card.color }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold">{card.nickname}</p>
          <p className="text-sm opacity-80">{card.bank}</p>
        </div>
        <div className="flex items-center gap-2">
          <NetworkLogo network={card.network} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(card)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Card
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(card)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Number Display */}
      <div className="my-6">
        <p className="font-mono text-xl tracking-[0.25em]">
          •••• •••• •••• {card.lastFourDigits}
        </p>
      </div>

      {/* Card Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-70">Outstanding</p>
          <p className="text-lg font-bold">{formatCurrency(card.outstandingBalance)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide opacity-70">Credit Limit</p>
          <p className="text-lg font-bold">{formatCurrency(card.creditLimit)}</p>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="opacity-70">Utilization</span>
          <span className={cn('font-medium', getUtilizationColor(utilization))}>
            {utilization.toFixed(1)}%
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-white/20">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              utilization < 30 ? 'bg-green-400' : utilization < 70 ? 'bg-yellow-400' : 'bg-red-400'
            )}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {card.emis.length > 0 && (
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              {card.emis.length} EMI{card.emis.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {daysUntilDue <= 3 && card.outstandingBalance > 0 && (
            <AlertCircle className="h-4 w-4 text-red-300" />
          )}
          <span className={cn(daysUntilDue <= 3 && card.outstandingBalance > 0 ? 'text-red-300' : 'opacity-70')}>
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
