import { nanoid } from 'nanoid';

import { createBlob } from '@/entities/blob/api/blob.repo';
import type { NodeRecord } from '@/entities/node/node.types';
import { ensureUniqueName } from '@/entities/node/node.utils';
import { db } from '@/shared/lib/database';

export const getNode = async (id: string): Promise<NodeRecord | undefined> =>
  await db.nodes.get(id);

export const listChildren = async (
  roomId: string,
  parentId: string | null,
): Promise<NodeRecord[]> => {
  if (parentId === null) {
    return await db.nodes
      .where('roomId')
      .equals(roomId)
      .and((node) => node.parentId === null)
      .toArray();
  }
  return await db.nodes.where({ roomId, parentId }).toArray();
};

export const listSiblingNameSet = async (
  roomId: string,
  parentId: string | null,
): Promise<Set<string>> => {
  let siblings: NodeRecord[];
  if (parentId === null) {
    siblings = await db.nodes
      .where('roomId')
      .equals(roomId)
      .and((node) => node.parentId === null)
      .toArray();
  } else {
    siblings = await db.nodes.where({ roomId, parentId }).toArray();
  }
  return new Set(siblings.map((s) => s.nameLower));
};

export const createFolder = async (
  roomId: string,
  parentId: string | null,
  name: string,
): Promise<NodeRecord> => {
  const existing = await listSiblingNameSet(roomId, parentId);
  const safe = ensureUniqueName(name, existing);
  const now = Date.now();
  const rec: NodeRecord = {
    id: nanoid(),
    roomId,
    parentId,
    type: 'folder',
    name: safe,
    nameLower: safe.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };
  await db.nodes.add(rec);
  return rec;
};

export const createFile = async (
  roomId: string,
  parentId: string | null,
  file: File,
): Promise<string> => {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF is supported');
  }

  const existing = await listSiblingNameSet(roomId, parentId);
  const safe = ensureUniqueName(file.name, existing);
  const now = Date.now();
  const id = nanoid();

  await db.transaction('rw', db.blobs, db.nodes, async () => {
    const blobId = await createBlob(file);
    await db.nodes.add({
      id,
      roomId,
      parentId,
      type: 'file',
      name: safe,
      nameLower: safe.toLowerCase(),
      createdAt: now,
      updatedAt: now,
      size: file.size,
      mime: file.type,
      blobId,
    });
  });

  return id;
};

export const renameNode = async (id: string, newName: string): Promise<void> => {
  const node = await db.nodes.get(id);
  if (!node) {
    return;
  }
  const existing = await listSiblingNameSet(node.roomId, node.parentId);
  existing.delete(node.nameLower);
  const safe = ensureUniqueName(newName, existing);
  await db.nodes.update(id, {
    name: safe,
    nameLower: safe.toLowerCase(),
    updatedAt: Date.now(),
  });
};

export const collectDescendantsBfs = async (rootId: string): Promise<string[]> => {
  const out: string[] = [];
  const q: string[] = [rootId];
  while (q.length > 0) {
    const curr = q.shift();
    if (!curr) {
      continue;
    }
    out.push(curr);
    const kids = await db.nodes.where('parentId').equals(curr).primaryKeys();
    q.push(...kids);
  }
  return out;
};

export const deleteCascade = async (id: string): Promise<void> => {
  const toDelete = await collectDescendantsBfs(id);
  const nodes = await db.nodes.bulkGet(toDelete);

  const blobIds: string[] = [];
  for (const node of nodes) {
    if (node && node.type === 'file' && node.blobId) {
      blobIds.push(node.blobId);
    }
  }

  await db.transaction('rw', db.nodes, db.blobs, async () => {
    if (blobIds.length) {
      await db.blobs.bulkDelete(blobIds);
    }
    await db.nodes.bulkDelete(toDelete);
  });
};

export const resolvePath = async (
  roomId: string,
  segments: string[],
): Promise<NodeRecord | null> => {
  let parentId: string | null = null;
  let current: NodeRecord | undefined;
  for (const seg of segments) {
    const lower = seg.toLowerCase();
    if (parentId === null) {
      current = await db.nodes
        .where('roomId')
        .equals(roomId)
        .and((node) => node.parentId === null && node.nameLower === lower && node.type === 'folder')
        .first();
    } else {
      current = await db.nodes
        .where({ roomId, parentId, nameLower: lower })
        .filter((n) => n.type === 'folder')
        .first();
    }
    if (!current) {
      return null;
    }
    parentId = current.id;
  }
  return current ?? null;
};

export const getNodesByParent = async (
  roomId: string | null,
  parentId: string | null,
): Promise<NodeRecord[]> => {
  if (!roomId) {
    return [];
  }

  let items: NodeRecord[];
  if (parentId === null) {
    items = await db.nodes
      .where('roomId')
      .equals(roomId)
      .and((node) => node.parentId === null)
      .toArray();
  } else {
    items = await db.nodes.where({ roomId, parentId }).toArray();
  }

  return items.sort((a, b) => {
    // Folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    // Alphabetically by name
    return a.name.localeCompare(b.name);
  });
};
