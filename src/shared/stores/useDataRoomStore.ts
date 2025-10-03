import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

type RoomId = string;
type NodeId = string;

interface DataRoomState {
  currentRoomId: RoomId | null;
  currentPath: NodeId[];
  selectedNodeId: NodeId | null;
  uploadProgress: number | null;
  setCurrentRoomId: (roomId: RoomId | null) => void;
  setCurrentPath: (path: NodeId[]) => void;
  navigateToFolder: (folderId: NodeId | null) => void;
  selectNodeId: (nodeId: NodeId | null) => void;
  getCurrentParentId: () => NodeId | null;
}

const createStoreImplementation = (
  set: (
    partial: Partial<DataRoomState> | ((state: DataRoomState) => Partial<DataRoomState>),
  ) => void,
  get: () => DataRoomState,
): DataRoomState => ({
  currentRoomId: null,
  currentPath: [],
  selectedNodeId: null,
  uploadProgress: null,

  setCurrentRoomId: (roomId: RoomId | null): void => {
    set({
      currentRoomId: roomId,
      currentPath: [],
      selectedNodeId: null,
    });
  },

  setCurrentPath: (path: NodeId[]): void => {
    set({ currentPath: path });
  },

  navigateToFolder: (folderId: NodeId | null): void => {
    set((state: DataRoomState) => {
      if (folderId === null) {
        return { currentPath: [] };
      }
      const folderIndex: number = state.currentPath.indexOf(folderId);
      if (folderIndex >= 0) {
        return { currentPath: state.currentPath.slice(0, folderIndex + 1) };
      }
      return { currentPath: [...state.currentPath, folderId] };
    });
  },

  selectNodeId: (nodeId: NodeId | null): void => {
    set({ selectedNodeId: nodeId });
  },

  getCurrentParentId: (): NodeId | null => {
    const state: DataRoomState = get();
    const { currentPath } = state;
    return currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;
  },
});

const useDataRoomStore: UseBoundStore<StoreApi<DataRoomState>> =
  create<DataRoomState>(createStoreImplementation);

export default useDataRoomStore;
