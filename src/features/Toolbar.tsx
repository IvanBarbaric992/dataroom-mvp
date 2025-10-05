import { useRef, type ChangeEvent } from 'react';

import { FolderPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/common/button';
import { createFile, createFolder } from '@/entities/node/node.repo';
import useDataRoomStore from '@/shared/stores/useDataRoomStore';

const Toolbar = () => {
  const currentRoomId = useDataRoomStore((state) => state.currentRoomId);
  const currentPath = useDataRoomStore((state) => state.currentPath);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFolder = async () => {
    if (!currentRoomId) {
      toast.error('No room selected', {
        description: 'Please select a room first.',
      });
      return;
    }

    try {
      const parentId = currentPath[currentPath.length - 1] || null;
      const baseName = 'New Folder';

      const folder = await createFolder(currentRoomId, parentId, baseName);

      toast.success('Folder created', {
        description: `"${folder.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder', {
        description: error instanceof Error ? error.message : 'Unknown error occurred.',
      });
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (!currentRoomId) {
      toast.error('No room selected', {
        description: 'Please select a room first.',
      });
      return;
    }

    const parentId = currentPath[currentPath.length - 1] || null;

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        toast.error(`"${file.name}" is not a PDF file`, {
          description: 'Only PDF files are supported.',
        });
        continue;
      }

      try {
        await createFile(currentRoomId, parentId, file);

        toast.success('File uploaded', {
          description: `"${file.name}" has been uploaded successfully.`,
        });
      } catch (error) {
        console.error(`Failed to upload "${file.name}":`, error);
        toast.error('Upload failed', {
          description: `Failed to upload "${file.name}".`,
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button className="gap-2" size="sm" variant="outline" onClick={handleCreateFolder}>
        <FolderPlus className="h-4 w-4" />
        <span className="hidden sm:inline">New Folder</span>
        <span className="sm:hidden">Folder</span>
      </Button>

      <Button
        className="gap-2"
        size="sm"
        variant="default"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Upload PDF</span>
        <span className="sm:hidden">Upload</span>
      </Button>

      <input
        ref={fileInputRef}
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        type="file"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Toolbar;
