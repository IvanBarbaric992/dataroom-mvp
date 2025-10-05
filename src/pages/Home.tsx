import { Suspense } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import DropZone from '@/features/DropZone';
import NodeList from '@/features/NodeList';
import Toolbar from '@/features/Toolbar';

const Home = () => (
  <>
    <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>
      <div className="flex-shrink-0">
        <Toolbar />
      </div>
    </div>

    <DropZone>
      <div className="min-h-[600px] rounded-xl border border-border/50 bg-card/50 p-4 shadow-lg shadow-primary/5 backdrop-blur-sm transition-all duration-150 hover:shadow-xl hover:shadow-primary/10 sm:p-6">
        <Suspense
          fallback={
            <div className="flex h-96 animate-pulse items-center justify-center text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          <NodeList />
        </Suspense>
      </div>
    </DropZone>
  </>
);

export default Home;
