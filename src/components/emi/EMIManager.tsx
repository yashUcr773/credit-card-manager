'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, EMI } from '@/types';
import { useCards } from '@/context/CardContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Calendar, IndianRupee, CreditCard as CardIcon } from 'lucide-react';
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

const emiSchema = z.object({
  cardId: z.string().min(1, 'Please select a card'),
  description: z.string().min(1, 'Description is required'),
  totalAmount: z.coerce.number().min(1, 'Amount must be positive'),
  emiAmount: z.coerce.number().min(1, 'EMI amount must be positive'),
  totalInstallments: z.coerce.number().min(1, 'Must be at least 1 installment'),
  paidInstallments: z.coerce.number().min(0, 'Cannot be negative'),
  startDate: z.string().min(1, 'Start date is required'),
});

type EMIFormData = z.infer<typeof emiSchema>;

interface EMIManagerProps {
  selectedCardId?: string;
}

export function EMIManager({ selectedCardId }: EMIManagerProps) {
  const { cards, updateCard, settings } = useCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emiToDelete, setEmiToDelete] = useState<{ cardId: string; emiId: string } | null>(null);

  const form = useForm<EMIFormData>({
    resolver: zodResolver(emiSchema) as any,
    defaultValues: {
      cardId: selectedCardId || '',
      description: '',
      totalAmount: 0,
      emiAmount: 0,
      totalInstallments: 3,
      paidInstallments: 0,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get all EMIs across all cards
  const allEmis = cards.flatMap((card) =>
    card.emis.map((emi) => ({ ...emi, card }))
  );

  const onSubmit = (data: EMIFormData) => {
    const card = cards.find((c) => c.id === data.cardId);
    if (!card) return;

    // Calculate next due date based on start date and paid installments
    const startDate = new Date(data.startDate);
    const nextDueDate = new Date(startDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + data.paidInstallments);

    const newEmi: EMI = {
      id: crypto.randomUUID(),
      description: data.description,
      totalAmount: data.totalAmount,
      emiAmount: data.emiAmount,
      totalInstallments: data.totalInstallments,
      paidInstallments: data.paidInstallments,
      startDate: data.startDate,
      nextDueDate: nextDueDate.toISOString().split('T')[0],
    };

    updateCard(card.id, {
      emis: [...card.emis, newEmi],
    });

    form.reset();
    setIsDialogOpen(false);
  };

  const handleDeleteEmi = () => {
    if (!emiToDelete) return;

    const card = cards.find((c) => c.id === emiToDelete.cardId);
    if (!card) return;

    updateCard(card.id, {
      emis: card.emis.filter((e) => e.id !== emiToDelete.emiId),
    });

    setEmiToDelete(null);
  };

  const handleIncrementPaid = (cardId: string, emiId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    updateCard(cardId, {
      emis: card.emis.map((emi) => {
        if (emi.id === emiId && emi.paidInstallments < emi.totalInstallments) {
          const nextDueDate = new Date(emi.nextDueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          return {
            ...emi,
            paidInstallments: emi.paidInstallments + 1,
            nextDueDate: nextDueDate.toISOString().split('T')[0],
          };
        }
        return emi;
      }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">EMI Tracker</h2>
          <p className="mt-1 text-muted-foreground">
            Track and manage your active EMIs across all cards
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          disabled={cards.length === 0}
          className="gap-2 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add EMI
        </Button>
      </div>

      {/* Summary */}
      {allEmis.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-0 bg-card shadow-lg shadow-black/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Total</p>
                  <div className="text-3xl font-bold">
                    {formatCurrency(allEmis.reduce((sum, e) => sum + e.emiAmount, 0))}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card shadow-lg shadow-black/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active EMIs</p>
                  <div className="text-3xl font-bold">{allEmis.length}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <CardIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card shadow-lg shadow-black/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Remaining</p>
                  <div className="text-3xl font-bold">
                    {formatCurrency(
                      allEmis.reduce(
                        (sum, e) => sum + e.emiAmount * (e.totalInstallments - e.paidInstallments),
                        0
                      )
                        )}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EMI List */}
      {allEmis.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-violet-500/10 animate-pulse" />
            </div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/25">
              <IndianRupee className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-6 text-center max-w-md">
            <h3 className="text-xl font-bold">No active EMIs</h3>
            <p className="mt-2 text-muted-foreground">
              {cards.length === 0
                ? 'Add a card first to start tracking EMIs'
                : 'Add an EMI to start tracking your installment payments'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {allEmis.map(({ card, ...emi }) => {
            const progress = (emi.paidInstallments / emi.totalInstallments) * 100;
            const remaining = emi.totalInstallments - emi.paidInstallments;
            const isCompleted = remaining === 0;

            return (
              <Card key={emi.id} className={`border-0 bg-card shadow-lg shadow-black/5 transition-all duration-300 ${isCompleted ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-xl'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` }}
                      >
                        <CardIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{emi.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {card.nickname} •••• {card.lastFourDigits}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {isCompleted
                              ? '✅ Completed'
                              : `Next due: ${new Date(emi.nextDueDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{formatCurrency(emi.emiAmount)}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">
                        {emi.paidInstallments} of {emi.totalInstallments} paid
                      </span>
                      <Badge 
                        variant={isCompleted ? 'secondary' : 'outline'}
                        className={isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      >
                        {isCompleted
                          ? '✓ Completed'
                          : `${remaining} remaining`}
                      </Badge>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => handleIncrementPaid(card.id, emi.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive rounded-xl"
                      onClick={() => setEmiToDelete({ cardId: card.id, emiId: emi.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add EMI Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New EMI</DialogTitle>
            <DialogDescription>
              Track a new EMI on one of your credit cards.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select card" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., iPhone 15 Pro" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount ({settings.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emiAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly EMI ({settings.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Installments</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paidInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Already Paid</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMI Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl shadow-lg shadow-primary/20">Add EMI</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!emiToDelete} onOpenChange={() => setEmiToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete EMI</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this EMI? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmi}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
