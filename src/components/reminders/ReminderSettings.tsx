'use client';

import { useCards } from '@/context/CardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Plus, Trash2, CreditCard as CardIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useState } from 'react';

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Reminders</h2>
        <p className="text-sm text-muted-foreground">
          Configure reminders to never miss a payment due date
        </p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Settings</CardTitle>
          <CardDescription>
            These settings apply to new reminders by default
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Default Reminder Days</Label>
              <p className="text-sm text-muted-foreground">
                How many days before the due date to remind
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={30}
                value={settings.defaultReminderDays}
                onChange={(e) => updateSettings({ defaultReminderDays: parseInt(e.target.value) || 3 })}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Reminder */}
      {cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Reminder</CardTitle>
            <CardDescription>
              Create a new reminder for one of your cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label>Card</Label>
                <Select value={newReminderCardId} onValueChange={setNewReminderCardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.nickname} •••• {card.lastFourDigits}
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
                  <SelectTrigger className="w-40">
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
                  className="w-24"
                />
              </div>

              <Button onClick={handleAddReminder} disabled={!newReminderCardId}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Reminders */}
      {reminders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No reminders set</EmptyTitle>
            <EmptyDescription>
              {cards.length === 0
                ? 'Add a card first to create reminders'
                : 'Create reminders to get notified before due dates'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {remindersByCard
            .filter((group) => group.reminders.length > 0)
            .map(({ card, reminders: cardReminders }) => (
              <Card key={card.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: card.color }}
                    >
                      <CardIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.nickname}</CardTitle>
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
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {reminder.enabled ? (
                          <Bell className="h-4 w-4 text-primary" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{getReminderTypeLabel(reminder.type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {reminder.daysBefore} day{reminder.daysBefore !== 1 ? 's' : ''} before
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={(enabled) =>
                            updateReminder(reminder.id, { enabled })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
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
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How reminders work</p>
              <p className="mt-1">
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
