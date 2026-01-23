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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">EMI Tracker</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage your active EMIs across all cards
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} disabled={cards.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add EMI
        </Button>
      </div>

      {/* Summary */}
      {allEmis.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {formatCurrency(allEmis.reduce((sum, e) => sum + e.emiAmount, 0))}
              </div>
              <p className="text-sm text-muted-foreground">Monthly EMI Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{allEmis.length}</div>
              <p className="text-sm text-muted-foreground">Active EMIs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  allEmis.reduce(
                    (sum, e) => sum + e.emiAmount * (e.totalInstallments - e.paidInstallments),
                    0
                  )
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Remaining</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EMI List */}
      {allEmis.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IndianRupee className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No active EMIs</EmptyTitle>
            <EmptyDescription>
              {cards.length === 0
                ? 'Add a card first to start tracking EMIs'
                : 'Add an EMI to start tracking your installment payments'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {allEmis.map(({ card, ...emi }) => {
            const progress = (emi.paidInstallments / emi.totalInstallments) * 100;
            const remaining = emi.totalInstallments - emi.paidInstallments;
            const isCompleted = remaining === 0;

            return (
              <Card key={emi.id} className={isCompleted ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: card.color }}
                      >
                        <CardIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{emi.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {card.nickname} •••• {card.lastFourDigits}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {isCompleted
                              ? 'Completed'
                              : `Next due: ${new Date(emi.nextDueDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">{formatCurrency(emi.emiAmount)}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {emi.paidInstallments} of {emi.totalInstallments} paid
                      </span>
                      <Badge variant={isCompleted ? 'secondary' : 'outline'}>
                        {isCompleted
                          ? 'Completed'
                          : `${remaining} remaining`}
                      </Badge>
                    </div>
                    <Progress value={progress} className="mt-2" />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIncrementPaid(card.id, emi.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New EMI</DialogTitle>
            <DialogDescription>
              Track a new EMI on one of your credit cards.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.nickname} •••• {card.lastFourDigits}
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
                      <Input placeholder="e.g., iPhone 15 Pro" {...field} />
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
                        <Input type="number" {...field} />
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
                        <Input type="number" {...field} />
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
                        <Input type="number" min={1} {...field} />
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
                        <Input type="number" min={0} {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add EMI</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!emiToDelete} onOpenChange={() => setEmiToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete EMI</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this EMI? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmi}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
