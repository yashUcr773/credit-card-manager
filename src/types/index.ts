export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'rupay' | 'discover' | 'diners' | 'other';

export type BillingCycle = {
  startDay: number; // 1-31
  endDay: number; // 1-31
};

export interface EMI {
  id: string;
  description: string;
  totalAmount: number;
  emiAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string; // ISO date
  nextDueDate: string; // ISO date
}

export interface CreditCard {
  id: string;
  nickname: string;
  bank: string;
  network: CardNetwork;
  lastFourDigits: string;
  creditLimit: number;
  billingCycle: BillingCycle;
  dueDate: number; // Day of month (1-31)
  outstandingBalance: number;
  lastBillAmount: number;
  emis: EMI[];
  color: string; // Card background color
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  cardId: string;
  type: 'due_date' | 'bill_generated' | 'emi_due';
  daysBefore: number;
  enabled: boolean;
}

export interface AppSettings {
  defaultReminderDays: number;
  currency: string;
  currencySymbol: string;
}

// Utility types
export interface DashboardStats {
  totalOutstanding: number;
  totalCreditLimit: number;
  totalUtilization: number;
  totalEMIAmount: number;
  upcomingDues: Array<{
    card: CreditCard;
    daysUntilDue: number;
    dueDate: Date;
  }>;
}
