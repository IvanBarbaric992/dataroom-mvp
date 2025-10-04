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
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Button
        className="h-8 px-2"
        size="sm"
        variant="ghost"
        onClick={() => {
          navigateToFolder(null);
        }}
      >
        <Home className="h-4 w-4" />
      </Button>

      {pathNodes?.map((node) => (
        <div key={node.id} className="flex items-center">
          <ChevronRight className="mx-1 h-4 w-4" />
          <Button
            className="h-8 px-2 font-medium"
            size="sm"
            variant="ghost"
            onClick={() => {
              navigateToFolder(node.id);
            }}
          >
            {node.name}
          </Button>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
