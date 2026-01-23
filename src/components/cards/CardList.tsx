'use client';

import { useState } from 'react';
import { CreditCard } from '@/types';
import { useCards } from '@/context/CardContext';
import { CreditCardDisplay } from './CreditCardDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, CreditCard as CardIcon, LayoutGrid, List } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CardIcon className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No cards added yet</EmptyTitle>
            <EmptyDescription>Add your first credit card to start tracking your finances</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Button onClick={onAddCard} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Card
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                viewMode === 'grid' && 'bg-background shadow-sm'
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                viewMode === 'list' && 'bg-background shadow-sm'
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={onAddCard}>
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Cards Grid/List */}
      {filteredCards.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No cards match your search
        </div>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-3'
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{cardToDelete?.nickname}&quot;? This action
              cannot be undone and will also remove all associated reminders and EMIs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
