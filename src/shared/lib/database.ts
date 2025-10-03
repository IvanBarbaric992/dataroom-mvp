import { Dexie, type EntityTable } from 'dexie';

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

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

export const db = new Dexie('DataRoomDB') as Dexie & {
  rooms: EntityTable<Room, 'id'>;
  nodes: EntityTable<NodeRecord, 'id'>;
  blobs: EntityTable<BlobRecord, 'id'>;
};

db.version(1).stores({
  rooms: '&id, name, createdAt, updatedAt',
  nodes:
    '&id, roomId, parentId, type, name, nameLower, [roomId+parentId], [roomId+parentId+type], [roomId+parentId+nameLower]',
  blobs: '&id',
});
