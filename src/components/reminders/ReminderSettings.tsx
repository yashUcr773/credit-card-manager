'use client';

import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Plus, Trash2, CreditCard as CardIcon, Clock, Lightbulb } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ReminderSettings() {
  const { cards, reminders, settings, addReminder, updateReminder, deleteReminder, updateSettings } = useCards();
  const [newReminderCardId, setNewReminderCardId] = useState<string>('');
  const [newReminderType, setNewReminderType] = useState<'due_date' | 'bill_generated' | 'emi_due'>('due_date');
  const [newReminderDays, setNewReminderDays] = useState<number>(3);

  const handleAddReminder = () => {
    if (!newReminderCardId) return;
    
    addReminder({
      cardId: newReminderCardId,
      type: newReminderType,
      daysBefore: newReminderDays,
      enabled: true,
    });
    
    setNewReminderCardId('');
    setNewReminderDays(3);
  };

  const getReminderTypeLabel = (type: string) => {
    switch (type) {
      case 'due_date': return 'Due Date';
      case 'bill_generated': return 'Bill Generated';
      case 'emi_due': return 'EMI Due';
      default: return type;
    }
  };

  const getCardForReminder = (cardId: string) => {
    return cards.find((c) => c.id === cardId);
  };

  // Group reminders by card
  const remindersByCard = cards.map((card) => ({
    card,
    reminders: reminders.filter((r) => r.cardId === card.id),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reminders</h2>
        <p className="mt-1 text-muted-foreground">
          Configure reminders to never miss a payment due date
        </p>
      </div>

      {/* Global Settings */}
      <Card className="border-0 bg-card shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Default Settings
          </CardTitle>
          <CardDescription>
            These settings apply to new reminders by default
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Default Reminder Days</Label>
              <p className="text-sm text-muted-foreground">
                How many days before the due date to remind
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={30}
                value={settings.defaultReminderDays}
                onChange={(e) => updateSettings({ defaultReminderDays: parseInt(e.target.value) || 3 })}
                className="w-20 rounded-xl text-center"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Reminder */}
      {cards.length > 0 && (
        <Card className="border-0 bg-card shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Add Reminder
            </CardTitle>
            <CardDescription>
              Create a new reminder for one of your cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label>Card</Label>
                <Select value={newReminderCardId} onValueChange={setNewReminderCardId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        <span className="flex items-center gap-2">
                          <span 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: card.color }}
                          />
                          {card.nickname} •••• {card.lastFourDigits}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reminder Type</Label>
                <Select
                  value={newReminderType}
                  onValueChange={(v) => setNewReminderType(v as typeof newReminderType)}
                >
                  <SelectTrigger className="w-44 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due_date">Due Date</SelectItem>
                    <SelectItem value="bill_generated">Bill Generated</SelectItem>
                    <SelectItem value="emi_due">EMI Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Days Before</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={newReminderDays}
                  onChange={(e) => setNewReminderDays(parseInt(e.target.value) || 3)}
                  className="w-24 rounded-xl text-center"
                />
              </div>

              <Button 
                onClick={handleAddReminder} 
                disabled={!newReminderCardId}
                className="gap-2 rounded-xl shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Reminders */}
      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-amber-500/10 animate-pulse" />
            </div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/25">
              <Bell className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-6 text-center max-w-md">
            <h3 className="text-xl font-bold">No reminders set</h3>
            <p className="mt-2 text-muted-foreground">
              {cards.length === 0
                ? 'Add a card first to create reminders'
                : 'Create reminders to get notified before due dates'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {remindersByCard
            .filter((group) => group.reminders.length > 0)
            .map(({ card, reminders: cardReminders }) => (
              <Card key={card.id} className="border-0 bg-card shadow-lg shadow-black/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` 
                      }}
                    >
                      <CardIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.nickname}</CardTitle>
                      <CardDescription>
                        {card.bank} •••• {card.lastFourDigits}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cardReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-all duration-200",
                        reminder.enabled 
                          ? "bg-muted/30 hover:bg-muted/50" 
                          : "bg-muted/10 opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          reminder.enabled 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {reminder.enabled ? (
                            <Bell className="h-5 w-5" />
                          ) : (
                            <BellOff className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{getReminderTypeLabel(reminder.type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {reminder.daysBefore} day{reminder.daysBefore !== 1 ? 's' : ''} before
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={(enabled) =>
                            updateReminder(reminder.id, { enabled })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive rounded-xl"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Info Note */}
      <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent shadow-lg shadow-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shrink-0">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-300">How reminders work</p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                Reminders are stored locally in your browser. For actual notifications,
                consider bookmarking this app and checking it regularly, or enable browser
                notifications (coming soon).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
