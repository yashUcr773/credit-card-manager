'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, EMI } from '@/types';
import { useCards } from '@/context/CardContext';
import { CARD_NETWORKS, POPULAR_BANKS, CARD_COLORS } from '@/lib/constants';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const cardSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(50, 'Nickname is too long'),
  bank: z.string().min(1, 'Bank is required'),
  network: z.enum(['visa', 'mastercard', 'amex', 'rupay', 'discover', 'diners', 'other']),
  lastFourDigits: z
    .string()
    .length(4, 'Must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Must contain only digits'),
  creditLimit: z.coerce.number().min(1, 'Credit limit must be positive'),
  billingStartDay: z.coerce.number().min(1).max(31),
  billingEndDay: z.coerce.number().min(1).max(31),
  dueDate: z.coerce.number().min(1, 'Due date is required').max(31, 'Invalid day'),
  outstandingBalance: z.coerce.number().min(0, 'Cannot be negative'),
  lastBillAmount: z.coerce.number().min(0, 'Cannot be negative'),
  color: z.string(),
});

type CardFormData = z.infer<typeof cardSchema>;

interface AddEditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardToEdit?: CreditCard | null;
}

export function AddEditCardDialog({ open, onOpenChange, cardToEdit }: AddEditCardDialogProps) {
  const { addCard, updateCard, settings } = useCards();
  const [activeTab, setActiveTab] = useState('details');
  const isEditing = !!cardToEdit;

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema) as any,
    defaultValues: {
      nickname: '',
      bank: '',
      network: 'visa',
      lastFourDigits: '',
      creditLimit: 0,
      billingStartDay: 1,
      billingEndDay: 28,
      dueDate: 15,
      outstandingBalance: 0,
      lastBillAmount: 0,
      color: CARD_COLORS[0],
    },
  });

  // Reset form when dialog opens/closes or when editing a different card
  useEffect(() => {
    if (open) {
      if (cardToEdit) {
        form.reset({
          nickname: cardToEdit.nickname,
          bank: cardToEdit.bank,
          network: cardToEdit.network,
          lastFourDigits: cardToEdit.lastFourDigits,
          creditLimit: cardToEdit.creditLimit,
          billingStartDay: cardToEdit.billingCycle.startDay,
          billingEndDay: cardToEdit.billingCycle.endDay,
          dueDate: cardToEdit.dueDate,
          outstandingBalance: cardToEdit.outstandingBalance,
          lastBillAmount: cardToEdit.lastBillAmount,
          color: cardToEdit.color,
        });
      } else {
        form.reset({
          nickname: '',
          bank: '',
          network: 'visa',
          lastFourDigits: '',
          creditLimit: 0,
          billingStartDay: 1,
          billingEndDay: 28,
          dueDate: 15,
          outstandingBalance: 0,
          lastBillAmount: 0,
          color: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)],
        });
      }
      setActiveTab('details');
    }
  }, [open, cardToEdit, form]);

  const onSubmit = (data: CardFormData) => {
    const cardData = {
      nickname: data.nickname,
      bank: data.bank,
      network: data.network,
      lastFourDigits: data.lastFourDigits,
      creditLimit: Number(data.creditLimit),
      billingCycle: {
        startDay: Number(data.billingStartDay),
        endDay: Number(data.billingEndDay),
      },
      dueDate: Number(data.dueDate),
      outstandingBalance: Number(data.outstandingBalance),
      lastBillAmount: Number(data.lastBillAmount),
      color: data.color,
      emis: cardToEdit?.emis || [],
    };

    if (isEditing && cardToEdit) {
      updateCard(cardToEdit.id, cardData);
    } else {
      addCard(cardData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Card' : 'Add New Card'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your card details below.'
              : 'Enter your card details. We only store non-sensitive information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="appearance">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Rewards Card" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {POPULAR_BANKS.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CARD_NETWORKS.map((network) => (
                              <SelectItem key={network.value} value={network.value}>
                                {network.label}
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
                    name="lastFourDigits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last 4 Digits</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234"
                            maxLength={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Limit ({settings.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingStartDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle Start</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={31} {...field} />
                        </FormControl>
                        <FormDescription>Day of month</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingEndDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle End</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={31} {...field} />
                        </FormControl>
                        <FormDescription>Day of month</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Due Date</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={31} {...field} />
                      </FormControl>
                      <FormDescription>Day of month when payment is due</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outstandingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Outstanding ({settings.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastBillAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Bill Amount ({settings.currencySymbol})</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Color</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-6 gap-2">
                          {CARD_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={cn(
                                'h-10 w-full rounded-lg border-2 transition-all',
                                field.value === color
                                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                                  : 'border-transparent hover:border-muted-foreground/30'
                              )}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview */}
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <div
                    className="rounded-xl p-4 text-white"
                    style={{ backgroundColor: form.watch('color') }}
                  >
                    <p className="font-semibold">{form.watch('nickname') || 'Card Nickname'}</p>
                    <p className="text-sm opacity-80">{form.watch('bank') || 'Bank Name'}</p>
                    <p className="mt-4 font-mono tracking-widest">
                      •••• •••• •••• {form.watch('lastFourDigits') || '••••'}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Card'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
