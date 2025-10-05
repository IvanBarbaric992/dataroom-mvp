import { FolderPlus, Upload } from 'lucide-react';

import { EMPTY_STATE_TYPES, type EmptyStateType } from '@/shared/constants/node.constants';

interface EmptyStateProps {
  type?: EmptyStateType;
  message?: string;
}

const EmptyState = ({ type = 'general', message }: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case EMPTY_STATE_TYPES.FOLDER:
        return <FolderPlus className="h-12 w-12 text-muted-foreground/50" />;
      case EMPTY_STATE_TYPES.FILE:
        return <Upload className="h-12 w-12 text-muted-foreground/50" />;
      default:
        return <FolderPlus className="h-12 w-12 text-muted-foreground/50" />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case EMPTY_STATE_TYPES.FOLDER:
        return 'No items yet';
      case EMPTY_STATE_TYPES.FILE:
        return 'No files uploaded';
      default:
        return 'Nothing here yet';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {getIcon()}
      <p className="mt-4 text-sm text-muted-foreground">{message ?? getDefaultMessage()}</p>
    </div>
  );
};

export default EmptyState;
