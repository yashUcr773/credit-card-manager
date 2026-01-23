'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CreditCard, Reminder, AppSettings, DashboardStats } from '@/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/lib/constants';

interface CardContextType {
  cards: CreditCard[];
  reminders: Reminder[];
  settings: AppSettings;
  isLoading: boolean;
  
  // Card operations
  addCard: (card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => CreditCard | undefined;
  
  // Reminder operations
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getCardReminders: (cardId: string) => Reminder[];
  
  // Settings operations
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Dashboard stats
  getDashboardStats: () => DashboardStats;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEYS.CARDS);
      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (storedCards) setCards(JSON.parse(storedCards));
      if (storedReminders) setReminders(JSON.parse(storedReminders));
      if (storedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist cards to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    }
  }, [cards, isLoading]);

  // Persist reminders to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    }
  }, [reminders, isLoading]);

  // Persist settings to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  const generateId = () => crypto.randomUUID();

  const addCard = useCallback((card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCard: CreditCard = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setCards((prev) => [...prev, newCard]);
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    // Also delete associated reminders
    setReminders((prev) => prev.filter((reminder) => reminder.cardId !== id));
  }, []);

  const getCard = useCallback((id: string) => {
    return cards.find((card) => card.id === id);
  }, [cards]);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
    };
    setReminders((prev) => [...prev, newReminder]);
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
  }, []);

  const getCardReminders = useCallback((cardId: string) => {
    return reminders.filter((reminder) => reminder.cardId === cardId);
  }, [reminders]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const getDashboardStats = useCallback((): DashboardStats => {
    const totalOutstanding = cards.reduce((sum, card) => sum + card.outstandingBalance, 0);
    const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
    const totalUtilization = totalCreditLimit > 0 ? (totalOutstanding / totalCreditLimit) * 100 : 0;
    const totalEMIAmount = cards.reduce(
      (sum, card) => sum + card.emis.reduce((emiSum, emi) => emiSum + emi.emiAmount, 0),
      0
    );

    // Calculate upcoming dues
    const today = new Date();
    const upcomingDues = cards
      .map((card) => {
        const dueDate = new Date(today.getFullYear(), today.getMonth(), card.dueDate);
        
        // If the due date has passed this month, get next month's due date
        if (dueDate < today) {
          dueDate.setMonth(dueDate.getMonth() + 1);
        }
        
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return { card, daysUntilDue, dueDate };
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    return {
      totalOutstanding,
      totalCreditLimit,
      totalUtilization,
      totalEMIAmount,
      upcomingDues,
    };
  }, [cards]);

  return (
    <CardContext.Provider
      value={{
        cards,
        reminders,
        settings,
        isLoading,
        addCard,
        updateCard,
        deleteCard,
        getCard,
        addReminder,
        updateReminder,
        deleteReminder,
        getCardReminders,
        updateSettings,
        getDashboardStats,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}
