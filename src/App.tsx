import { Database } from 'lucide-react';

const App = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Data Room</h1>
          </div>
        </div>
      </div>
    </header>

    <div className="container mx-auto px-6 py-6">
      <div className="mb-6 flex items-center justify-between"></div>

      <div className="min-h-[600px] rounded-xl border bg-card p-6"></div>
    </div>
  </div>
);

export default App;
