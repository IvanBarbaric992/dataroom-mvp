import { Suspense } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import DropZone from '@/features/DropZone';
import NodeList from '@/features/NodeList';
import Toolbar from '@/features/Toolbar';

const Home = () => (
  <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Breadcrumbs />
      <Toolbar />
    </div>

    <DropZone>
      <div className="min-h-[600px] rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-lg sm:p-6">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
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
