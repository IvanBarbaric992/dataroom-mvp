import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronRight, Home } from 'lucide-react';

import Button from '@/components/common/button';
import { db, type NodeRecord } from '@/shared/lib/database';
import useDataRoomStore from '@/shared/stores/useDataRoomStore';

const Breadcrumbs = () => {
  const currentPath = useDataRoomStore((state) => state.currentPath);
  const navigateToFolder = useDataRoomStore((state) => state.navigateToFolder);

  const pathNodes = useLiveQuery(async () => {
    if (currentPath.length === 0) {
      return [];
    }

    const nodes = await db.nodes.bulkGet(currentPath);

    return nodes.filter((node): node is NodeRecord => node !== undefined);
  }, [currentPath]);

  return (
    <div className="relative">
      <div className="scrollbar-hide overflow-x-auto scroll-smooth">
        <nav className="flex min-w-max items-center space-x-1 pr-8 pb-1 text-sm text-muted-foreground">
          <Button
            aria-label="Go to home folder"
            className="h-8 flex-shrink-0 px-2"
            size="sm"
            variant="ghost"
            onClick={() => {
              navigateToFolder(null);
            }}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Home</span>
          </Button>

          {pathNodes?.map((node) => (
            <div key={node.id} className="flex flex-shrink-0 items-center">
              <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0" />
              <Button
                className="h-8 flex-shrink-0 px-2 font-medium"
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigateToFolder(node.id);
                }}
              >
                <span className="whitespace-nowrap" title={node.name}>
                  {node.name}
                </span>
              </Button>
            </div>
          ))}
        </nav>
      </div>

      {pathNodes && pathNodes.length > 2 && (
        <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
      )}
    </div>
  );
};

export default Breadcrumbs;
