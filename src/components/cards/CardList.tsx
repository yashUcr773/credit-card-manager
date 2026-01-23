'use client';

import { useState } from 'react';
import { CreditCard } from '@/types';
import { useCards } from '@/context/CardContext';
import { CreditCardDisplay } from './CreditCardDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, CreditCard as CardIcon, LayoutGrid, List, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

interface CardListProps {
  onAddCard: () => void;
  onEditCard: (card: CreditCard) => void;
}

export function CardList({ onAddCard, onEditCard }: CardListProps) {
  const { cards, deleteCard } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);

  const filteredCards = cards.filter(
    (card) =>
      card.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.lastFourDigits.includes(searchQuery)
  );

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      deleteCard(cardToDelete.id);
      setCardToDelete(null);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-primary/10 animate-pulse" />
          </div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25">
            <CardIcon className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <div className="mt-8 text-center max-w-md">
          <h3 className="text-2xl font-bold">No cards added yet</h3>
          <p className="mt-2 text-muted-foreground">
            Add your first credit card to start tracking your finances securely and privately.
          </p>
        </div>
        <Button onClick={onAddCard} size="lg" className="mt-8 gap-2 rounded-xl shadow-lg shadow-primary/25">
          <Plus className="h-5 w-5" />
          Add Your First Card
        </Button>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          All data stored locally on your device
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 rounded-xl border-border/50 bg-muted/50 focus:bg-background transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-muted/50 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 w-9 p-0 rounded-lg transition-all duration-200',
                viewMode === 'grid' && 'bg-background shadow-md'
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 w-9 p-0 rounded-lg transition-all duration-200',
                viewMode === 'list' && 'bg-background shadow-md'
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={onAddCard} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Cards Grid/List */}
      {filteredCards.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-lg font-medium">No cards found</p>
          <p className="mt-1 text-muted-foreground">Try adjusting your search query</p>
        </div>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
              : 'space-y-4'
          )}
        >
          {filteredCards.map((card) => (
            <CreditCardDisplay
              key={card.id}
              card={card}
              compact={viewMode === 'list'}
              onEdit={onEditCard}
              onDelete={setCardToDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!cardToDelete} onOpenChange={() => setCardToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Card</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete &quot;{cardToDelete?.nickname}&quot;? This action
              cannot be undone and will also remove all associated reminders and EMIs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete Card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
