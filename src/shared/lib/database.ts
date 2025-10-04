import Dexie, { type EntityTable } from 'dexie';

export type NodeType = 'folder' | 'file';

export interface NodeRecord {
  id: string;
  roomId: string;
  parentId: string | null;
  type: NodeType;
  name: string;
  nameLower: string;
  createdAt: number;
  updatedAt: number;
  size?: number;
  mime?: string;
  blobId?: string;
}

export interface BlobRecord {
  id: string;
  data: Blob;
}

class AppDB extends Dexie {
  nodes!: EntityTable<NodeRecord, 'id'>;
  blobs!: EntityTable<BlobRecord, 'id'>;

  constructor() {
    super('DataRoomDB');
    this.version(1).stores({
      nodes:
        '&id, roomId, parentId, type, name, nameLower, ' +
        '[roomId+parentId], [roomId+parentId+type], [roomId+parentId+nameLower]',
      blobs: '&id',
    });
  }
}

export const db = new AppDB();
