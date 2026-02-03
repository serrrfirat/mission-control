'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastProvider } from '@/components/shared/Toast';
import { ConvexClientProvider } from '@/lib/convex/provider';
import { useGatewayStatus } from '@/lib/hooks/useGatewayStatus';

function GatewayPoller() {
  useGatewayStatus(10000);
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <ToastProvider>
        <GatewayPoller />
        <div className="flex flex-col min-h-dvh bg-dots">
          <Header />
          <main className="flex-1 overflow-y-auto pb-16">{children}</main>
          <BottomNav />
        </div>
      </ToastProvider>
    </ConvexClientProvider>
  );
}
