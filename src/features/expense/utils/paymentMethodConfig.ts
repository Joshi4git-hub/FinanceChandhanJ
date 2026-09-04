import { Smartphone, Banknote, CreditCard, Landmark } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PaymentMethod } from '../types';

export interface PaymentMethodConfig {
  label: string;
  icon: LucideIcon;
}

export const paymentMethodConfig: Record<PaymentMethod, PaymentMethodConfig> = {
  UPI: { label: 'UPI', icon: Smartphone },
  CASH: { label: 'Cash', icon: Banknote },
  CARD: { label: 'Card', icon: CreditCard },
  BANK: { label: 'Bank Transfer', icon: Landmark },
};
