'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CardProvider } from '@/context/CardContext';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <CardProvider>
        {children}
      </CardProvider>
    </ProtectedRoute>
  );
}
