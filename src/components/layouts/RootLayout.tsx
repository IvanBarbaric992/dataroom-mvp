import { Database } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import Toaster from '@/components/common/sonner';

const RootLayout = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex cursor-pointer items-center gap-2 transition-transform duration-200 hover:scale-105">
            <div className="rounded-lg bg-primary p-2">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Data Room</h1>
          </div>
        </div>
      </div>
    </header>

    <main className="container mx-auto px-4 py-6 sm:px-6">
      <Outlet />
    </main>

    <Toaster />
  </div>
);

export default RootLayout;
