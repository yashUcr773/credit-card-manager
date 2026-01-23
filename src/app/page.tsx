'use client';

import { useState } from 'react';
import { CreditCard } from '@/types';
import { useCards } from '@/context/CardContext';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { CardList } from '@/components/cards/CardList';
import { AddEditCardDialog } from '@/components/cards/AddEditCardDialog';
import { EMIManager } from '@/components/emi/EMIManager';
import { ReminderSettings } from '@/components/reminders/ReminderSettings';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Button } from '@/components/ui/button';
import {
  CreditCard as CardIcon,
  LayoutDashboard,
  IndianRupee,
  Bell,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isLoading } = useCards();
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cards', label: 'Cards', icon: CardIcon },
    { id: 'emis', label: 'EMIs', icon: IndianRupee },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CardIcon className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                <CardIcon className="h-5 w-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Credit Card Manager</h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Privacy First</span>
                <span className="text-primary">•</span>
                <span>100% Local</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <div className="flex items-center gap-1 rounded-2xl bg-muted/50 p-1.5 backdrop-blur-sm">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2 rounded-xl px-4 transition-all duration-200',
                    activeTab === tab.id 
                      ? 'bg-background text-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </Button>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation - Fixed Bottom */}
      </header>

      {/* Main Content */}
      <main className="container relative px-4 py-8 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="mt-1 text-muted-foreground">
                  Overview of all your credit cards and upcoming payments
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>All data stored locally</span>
              </div>
            </div>
            <DashboardStats />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Cards</h2>
              <p className="mt-1 text-muted-foreground">
                Manage your credit cards securely
              </p>
            </div>
            <CardList
              onAddCard={() => setIsAddDialogOpen(true)}
              onEditCard={handleEditCard}
            />
          </div>
        )}

        {activeTab === 'emis' && <EMIManager />}
        {activeTab === 'reminders' && <ReminderSettings />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={cn(
                'h-5 w-5 transition-transform duration-200',
                activeTab === tab.id && 'scale-110'
              )} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:hidden" />

      {/* Add/Edit Card Dialog */}
      <AddEditCardDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        cardToEdit={cardToEdit}
      />
    </div>
  );
}
