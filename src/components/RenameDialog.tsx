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
import { listSiblingNameSet, renameNode } from '@/entities/node/node.repo';
import type { NodeRecord } from '@/entities/node/node.types';

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: NodeRecord | null;
}

const RenameDialog = ({ open, onOpenChange, node }: RenameDialogProps) => {
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    if (!node || !newName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    const trimmedName = newName.trim();

    if (trimmedName.toLowerCase() === node.nameLower) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      const existingNames = await listSiblingNameSet(node.roomId, node.parentId);
      existingNames.delete(node.nameLower);

      if (existingNames.has(trimmedName.toLowerCase())) {
        toast.error('A file or folder with this name already exists in this location');
        setIsLoading(false);
        return;
      }

      await renameNode(node.id, trimmedName);
      toast.success(`Renamed "${node.name}" to "${trimmedName}"`);
      onOpenChange(false);
    } catch {
      toast.error('Failed to rename');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {node?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
          <DialogDescription>Enter a new name for "{node?.name}"</DialogDescription>
        </DialogHeader>

        <input
          autoFocus
          className="w-full rounded border px-3 py-2"
          type="text"
          value={newName !== '' ? newName : (node?.name ?? '')}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleRename}>
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
