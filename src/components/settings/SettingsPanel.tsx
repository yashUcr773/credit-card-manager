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
import { Shield, Database, Trash2 } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize your app preferences
        </p>
      </div>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Currency</CardTitle>
          <CardDescription>
            Choose how monetary values are displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Currency</Label>
            <Select value={settings.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4" />
            Your Data
          </CardTitle>
          <CardDescription>
            All data is stored locally in your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{cards.length}</p>
              <p className="text-sm text-muted-foreground">Cards</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">
                {cards.reduce((sum, c) => sum + c.emis.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">EMIs</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{reminders.length}</p>
              <p className="text-sm text-muted-foreground">Reminders</p>
            </div>
          </div>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your cards, EMIs, reminders, and settings.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Privacy First
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                This app is designed with your privacy in mind:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>All data is stored locally in your browser</li>
                <li>No data is sent to any server</li>
                <li>We never store full card numbers, CVV, or OTP</li>
                <li>No bank integrations or account linking</li>
                <li>You have full control over your data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Credit Card Manager is a privacy-first tool to help you track your
            credit cards, monitor spending, and never miss a payment.
          </p>
          <p className="mt-2">Version 1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
