import { create } from 'zustand';

type RoomId = string;
type NodeId = string;

interface DataRoomState {
  currentRoomId: RoomId | null;
  currentPath: NodeId[];
  navigateToFolder: (folderId: NodeId | null) => void;
  getCurrentParentId: () => NodeId | null;
}

const useDataRoomStore = create<DataRoomState>()((set, get) => ({
  currentRoomId: 'default-room-id',
  currentPath: [],

  navigateToFolder: (folderId) => {
    set((state) => {
      if (folderId === null) {
        return { currentPath: [] };
      }

      const folderIndex = state.currentPath.indexOf(folderId);

      if (folderIndex >= 0) {
        return { currentPath: state.currentPath.slice(0, folderIndex + 1) };
      }

      return { currentPath: [...state.currentPath, folderId] };
    });
  },

  getCurrentParentId: () => {
    const state = get();
    return state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : null;
  },
}));

export default useDataRoomStore;
