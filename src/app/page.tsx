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
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isLoading } = useCards();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CardIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Credit Card Manager</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Privacy First</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <div className="flex items-center rounded-lg border bg-muted p-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2',
                    activeTab === tab.id && 'bg-background shadow-sm'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t bg-background p-4 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  className="justify-start gap-2"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">
                Overview of all your credit cards and upcoming payments
              </p>
            </div>
            <DashboardStats />
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Cards</h2>
              <p className="text-muted-foreground">
                Manage your credit cards
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

      {/* Add/Edit Card Dialog */}
      <AddEditCardDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        cardToEdit={cardToEdit}
      />
    </div>
  );
}
