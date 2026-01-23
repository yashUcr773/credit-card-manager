import { CardNetwork, AppSettings } from '@/types';

export const CARD_NETWORKS: { value: CardNetwork; label: string }[] = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'rupay', label: 'RuPay' },
  { value: 'discover', label: 'Discover' },
  { value: 'diners', label: 'Diners Club' },
  { value: 'other', label: 'Other' },
];

export const POPULAR_BANKS = [
  'HDFC Bank',
  'ICICI Bank',
  'SBI',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'American Express',
  'Citibank',
  'RBL Bank',
  'IndusInd Bank',
  'Yes Bank',
  'HSBC',
  'Standard Chartered',
  'Bank of Baroda',
  'Punjab National Bank',
  'Canara Bank',
  'Other',
];

export const CARD_COLORS = [
  '#1e293b', // Slate
  '#0f172a', // Dark blue
  '#18181b', // Zinc
  '#1c1917', // Stone
  '#292524', // Warm gray
  '#0c4a6e', // Sky dark
  '#134e4a', // Teal dark
  '#365314', // Lime dark
  '#713f12', // Amber dark
  '#7c2d12', // Orange dark
  '#881337', // Rose dark
  '#4c1d95', // Violet dark
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultReminderDays: 3,
  currency: 'INR',
  currencySymbol: '₹',
};

export const STORAGE_KEYS = {
  CARDS: 'ccm_cards',
  REMINDERS: 'ccm_reminders',
  SETTINGS: 'ccm_settings',
} as const;
