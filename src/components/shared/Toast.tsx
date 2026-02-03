'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  toast: (message: string, type?: ToastData['type']) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((message: string, type: ToastData['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2.5 max-w-[320px]">
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  data,
  onDismiss,
}: {
  data: ToastData;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(data.id), 3000);
    return () => clearTimeout(timer);
  }, [data.id, onDismiss]);

  const accentColor =
    data.type === 'success'
      ? 'border-l-success'
      : data.type === 'error'
        ? 'border-l-error'
        : 'border-l-accent';

  return (
    <div
      className={`glass rounded-xl px-4 py-2.5 border-l-2 ${accentColor} animate-slide-in flex items-center justify-between gap-3`}
    >
      <span className="text-xs font-light">{data.message}</span>
      <button onClick={() => onDismiss(data.id)} className="text-muted hover:text-foreground transition-colors duration-300">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
