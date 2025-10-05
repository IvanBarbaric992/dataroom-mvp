import { Database } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import Toaster from '@/components/common/sonner';

const RootLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex cursor-pointer items-center gap-2 transition-all duration-150 hover:scale-105">
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-lg shadow-primary/20">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
              Data Room
            </h1>
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
