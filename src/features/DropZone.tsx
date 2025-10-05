import { type ReactNode } from 'react';

import { CloudUpload, FileX } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { createFile } from '@/entities/node/node.repo';
import useDataRoomStore from '@/shared/stores/useDataRoomStore';

interface DropZoneProps {
  children: ReactNode;
}

const DropZone = ({ children }: DropZoneProps) => {
  const currentRoomId = useDataRoomStore((state) => state.currentRoomId);
  const currentPath = useDataRoomStore((state) => state.currentPath);

  const handleFileUpload = async (files: File[]) => {
    if (!currentRoomId) {
      toast.error('No room selected', {
        description: 'Please select a room first.',
      });
      return;
    }

    const parentId = currentPath[currentPath.length - 1] || null;

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        toast.error(`"${file.name}" is not a PDF file`, {
          description: 'Only PDF files are supported.',
        });
        continue;
      }

      try {
        await createFile(currentRoomId, parentId, file);

        toast.success('File uploaded', {
          id: `file-uploaded-${Date.now().toString()}`,
          description: `"${file.name}" has been uploaded successfully.`,
        });
      } catch (error) {
        console.error(`Failed to upload "${file.name}":`, error);
        toast.error('Upload failed', {
          description: `Failed to upload "${file.name}".`,
        });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: handleFileUpload,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        toast.error(`"${file.file.name}" is not a valid file type`, {
          description: 'Only PDF files are supported.',
        });
      });
    },
    accept: {
      'application/pdf': ['.pdf'],
    },
    noClick: true,
    noKeyboard: true,
  });

  const getDropzoneStyles = () => {
    if (isDragReject) {
      return 'ring-2 ring-destructive/50 bg-destructive/5';
    }
    if (isDragAccept) {
      return 'ring-2 ring-primary/50 bg-primary/5';
    }
    if (isDragActive) {
      return 'ring-2 ring-muted-foreground/50 bg-muted/50';
    }
    return '';
  };

  return (
    <div
      {...getRootProps()}
      className={`relative transition-all duration-200 ${getDropzoneStyles()}`}
    >
      <input {...getInputProps()} />
      {children}

      {isDragActive && (
        <div
          className={`absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm`}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            {isDragReject ? (
              <>
                <div className="rounded-full bg-destructive/10 p-4">
                  <FileX className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <p className="text-lg font-medium text-destructive">Invalid file type</p>
                  <p className="text-sm text-muted-foreground">Only PDF files are supported</p>
                </div>
              </>
            ) : (
              <>
                <div className="animate-bounce rounded-full bg-primary/10 p-4">
                  <CloudUpload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drop PDF files here</p>
                  <p className="text-sm text-muted-foreground">
                    Release to upload to current folder
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
