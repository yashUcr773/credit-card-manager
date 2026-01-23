'use client';

import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Shield, Database, Trash2, CreditCard, Bell, Receipt, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { STORAGE_KEYS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const CURRENCIES = [
  { value: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { value: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { value: 'EUR', symbol: '€', label: 'Euro (€)' },
  { value: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { value: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { value: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
  { value: 'SGD', symbol: 'S$', label: 'Singapore Dollar (S$)' },
  { value: 'AED', symbol: 'د.إ', label: 'UAE Dirham (د.إ)' },
];

export function SettingsPanel() {
  const { settings, updateSettings, cards, reminders } = useCards();

  const handleCurrencyChange = (value: string) => {
    const currency = CURRENCIES.find((c) => c.value === value);
    if (currency) {
      updateSettings({
        currency: currency.value,
        currencySymbol: currency.symbol,
      });
    }
  };

  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.CARDS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    window.location.reload();
  };

  const dataStats = [
    { 
      label: 'Cards', 
      value: cards.length, 
      icon: CreditCard,
      color: 'from-violet-500 to-purple-600'
    },
    { 
      label: 'EMIs', 
      value: cards.reduce((sum, c) => sum + c.emis.length, 0), 
      icon: Receipt,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      label: 'Reminders', 
      value: reminders.length, 
      icon: Bell,
      color: 'from-amber-500 to-orange-600'
    },
  ];

  const privacyFeatures = [
    'All data stored locally in your browser',
    'No data is sent to any server',
    'We never store full card numbers, CVV, or OTP',
    'No bank integrations or account linking',
    'You have full control over your data',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-muted-foreground">
          Customize your app preferences
        </p>
      </div>

      {/* Currency Settings */}
      <Card className="border-0 bg-card shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <span className="text-xl text-white font-bold">{settings.currencySymbol}</span>
            </div>
            Display Currency
          </CardTitle>
          <CardDescription>
            Choose how monetary values are displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label className="text-base">Currency</Label>
            <Select value={settings.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-64 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-center font-medium">{currency.symbol}</span>
                      {currency.label.split('(')[0].trim()}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-0 bg-card shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              Your Data
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                All data is stored locally in your browser
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {dataStats.map((stat) => (
              <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-4 text-center transition-all duration-200 hover:bg-muted/50">
                <div className={cn(
                  'mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg mb-3',
                  stat.color
                )}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full rounded-xl h-12 text-base gap-2">
                <Trash2 className="h-5 w-5" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Clear All Data</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  This will permanently delete all your cards, EMIs, reminders, and settings.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                >
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent shadow-lg shadow-emerald-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                Privacy First
              </p>
              <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                This app is designed with your privacy in mind
              </p>
              <ul className="mt-4 space-y-2">
                {privacyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-0 bg-card shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Credit Card Manager is a privacy-first tool to help you track your
            credit cards, monitor spending, and never miss a payment.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Version 1.0.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
