import { create } from 'zustand';

type RoomId = string;
type NodeId = string;

interface DataRoomState {
  currentRoomId: RoomId | null;
  currentPath: NodeId[];
  selectedNodeId: NodeId | null;
  uploadProgress: number | null;
  setCurrentRoomId: (roomId: RoomId | null) => void;
  navigateToFolder: (folderId: NodeId | null) => void;
  selectNodeId: (nodeId: NodeId | null) => void;
  getCurrentParentId: () => NodeId | null;
}

const useDataRoomStore = create<DataRoomState>()((set, get) => ({
  currentRoomId: 'default-room-id',
  currentPath: [],
  selectedNodeId: null,
  uploadProgress: null,

  setCurrentRoomId: (roomId) => {
    set({
      currentRoomId: roomId,
      currentPath: [],
      selectedNodeId: null,
    });
  },

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

  selectNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  getCurrentParentId: () => {
    const state = get();
    return state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : null;
  },
}));

export default useDataRoomStore;
