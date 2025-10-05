import { useState } from 'react';

import { format } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, FileText, Folder, MoreVertical } from 'lucide-react';

import Button from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import EmptyState from '@/components/EmptyState';
import { getNodesByParent } from '@/entities/node/node.repo';
import type { NodeRecord } from '@/entities/node/node.types';
import formatBytes from '@/shared/lib/format';
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload';
import useDataRoomStore from '@/shared/stores/useDataRoomStore';

const PdfViewer = lazyWithPreload(() => import('./PdfViewer'));
const RenameDialog = lazyWithPreload(() => import('../components/RenameDialog'));
const DeleteDialog = lazyWithPreload(() => import('../components/DeleteDialog'));

const NodeList = () => {
  const [selectedNode, setSelectedNode] = useState<NodeRecord | null>(null);
  const [openDialog, setOpenDialog] = useState<{
    rename: boolean;
    delete: boolean;
  }>({
    rename: false,
    delete: false,
  });
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const currentRoomId = useDataRoomStore((state) => state.currentRoomId);
  const currentPath = useDataRoomStore((state) => state.currentPath);
  const navigateToFolder = useDataRoomStore((state) => state.navigateToFolder);

  const nodes = useLiveQuery(async () => {
    if (!currentRoomId) {
      return [];
    }
    const parentId = currentPath[currentPath.length - 1] || null;
    return await getNodesByParent(currentRoomId, parentId);
  }, [currentRoomId, currentPath]);

  const handleNodeClick = (node: NodeRecord) => {
    if (node.type === 'folder') {
      navigateToFolder(node.id);
    } else {
      setSelectedNode(node);
      setPdfViewerOpen(true);
    }
  };

  const handlePdfPreload = () => {
    PdfViewer.preload();
  };

  const handleOpenRenameDialog = (node: NodeRecord) => {
    setSelectedNode(node);
    setOpenDialog({ ...openDialog, rename: true });
  };

  const handleOpenDeleteDialog = (node: NodeRecord) => {
    setSelectedNode(node);
    setOpenDialog({ ...openDialog, delete: true });
  };

  const hasParent = currentPath.length > 0;

  const handleGoBack = () => {
    if (currentPath.length > 1) {
      const parentId = currentPath[currentPath.length - 2];
      navigateToFolder(parentId);
    } else {
      navigateToFolder(null);
    }
  };

  if (!nodes) {
    return (
      <div className="space-y-4">
        {hasParent && (
          <Button className="gap-2" size="sm" variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="space-y-4">
        {hasParent && (
          <Button className="gap-2" size="sm" variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div className="flex h-96 w-full items-center justify-center">
          <EmptyState message="Create a folder or upload files to get started" type="folder" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasParent && (
        <Button className="gap-2" size="sm" variant="outline" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      <div className="grid grid-cols-1 gap-2">
        {nodes.map((node) => {
          const Icon = node.type === 'folder' ? Folder : FileText;
          const nodeLabel = node.type === 'folder' ? 'Folder' : formatBytes(node.size ?? 0);

          return (
            <div
              key={node.id}
              className={`group flex items-center gap-3 rounded-lg border bg-card p-3 transition-all duration-200 hover:scale-[1.01] hover:border-blue-200 hover:bg-blue-50 hover:shadow-md`}
            >
              <button
                aria-label={`Open ${node.name}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                onMouseEnter={node.type === 'file' ? handlePdfPreload : undefined}
                onTouchStart={node.type === 'file' ? handlePdfPreload : undefined}
                onClick={() => {
                  handleNodeClick(node);
                }}
              >
                <Icon aria-hidden="true" className={`h-5 w-5 flex-shrink-0 text-primary`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{node.name}</p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                    <span>{nodeLabel}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>
                      {node.type === 'folder'
                        ? `Created ${format(node.createdAt, 'MMM d, yyyy')}`
                        : `Added ${format(node.createdAt, 'MMM d, yyyy')}`}
                    </span>
                    {node.createdAt !== node.updatedAt && (
                      <>
                        <span className="hidden sm:inline">·</span>
                        <span>
                          {node.type === 'folder'
                            ? `Updated ${format(node.updatedAt, 'MMM d, yyyy')}`
                            : `Modified ${format(node.updatedAt, 'MMM d, yyyy')}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label={`Options for ${node.name}`}
                    className={`h-8 w-8 p-0`}
                    size="sm"
                    variant="ghost"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  onMouseEnter={() => {
                    RenameDialog.preload();
                    DeleteDialog.preload();
                  }}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      handleOpenRenameDialog(node);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      handleOpenDeleteDialog(node);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}

        <RenameDialog
          key={`rename-${selectedNode?.id ?? 'none'}`}
          node={selectedNode}
          open={openDialog.rename}
          onOpenChange={(open) => {
            setOpenDialog({ ...openDialog, rename: open });
          }}
        />

        <DeleteDialog
          key={`delete-${selectedNode?.id ?? 'none'}`}
          node={selectedNode}
          open={openDialog.delete}
          onOpenChange={(open) => {
            setOpenDialog({ ...openDialog, delete: open });
          }}
        />

        <PdfViewer node={selectedNode} open={pdfViewerOpen} onOpenChange={setPdfViewerOpen} />
      </div>
    </div>
  );
};

export default NodeList;
