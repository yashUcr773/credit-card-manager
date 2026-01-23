'use client';

import { useState } from 'react';
import { CreditCard } from '@/types';
import { useCards } from '@/context/CardContext';
import { CardList } from '@/components/cards/CardList';
import { AddEditCardDialog } from '@/components/cards/AddEditCardDialog';
import { Button } from '@/components/ui/button';
import {
  CreditCard as CardIcon,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function CardsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);

  const handleEditCard = (card: CreditCard) => {
    setCardToEdit(card);
    setIsAddDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setCardToEdit(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center gap-4 px-4 lg:px-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
              <CardIcon className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">My Cards</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative px-4 py-8 lg:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Credit Cards</h2>
            <p className="mt-1 text-muted-foreground">
              Manage all your credit cards securely
            </p>
          </div>
          <CardList
            onAddCard={() => setIsAddDialogOpen(true)}
            onEditCard={handleEditCard}
          />
        </div>
      </main>

      {/* Add/Edit Card Dialog */}
      <AddEditCardDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        cardToEdit={cardToEdit}
      />
    </div>
  );
}
