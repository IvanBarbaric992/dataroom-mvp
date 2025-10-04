import { useState } from 'react';

import { toast } from 'sonner';

import Button from '@/components/common/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/dialog';
import { deleteCascade } from '@/entities/node/node.repo';
import type { NodeRecord } from '@/entities/node/node.types';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: NodeRecord | null;
}

const DeleteDialog = ({ open, onOpenChange, node }: DeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!node) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteCascade(node.id);
      toast.success(`Deleted "${node.name}"`);
      onOpenChange(false);
    } catch (_error) {
      toast.error('Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {node?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{node?.name}"? This action cannot be undone.
            {node?.type === 'folder' && ' All files and subfolders will also be deleted.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleDelete}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
