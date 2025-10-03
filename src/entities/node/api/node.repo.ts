import { nanoid } from 'nanoid';

import { createBlob } from '@/entities/blob/api/blob.repo';
import { ensureUniqueName } from '@/entities/node/lib/name';
import type { NodeRecord } from '@/entities/node/model/types';
import { db } from '@/shared/lib/database';

const getNode = async (id: string): Promise<NodeRecord | undefined> => await db.nodes.get(id);

const listChildren = async (roomId: string, parentId: string | null): Promise<NodeRecord[]> =>
  await db.nodes.where({ roomId, parentId }).toArray();

const listSiblingNameSet = async (
  roomId: string,
  parentId: string | null,
): Promise<Set<string>> => {
  const siblings = await db.nodes.where({ roomId, parentId }).toArray();
  return new Set(siblings.map((s) => s.nameLower));
};

const createFolder = async (
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

const createFile = async (roomId: string, parentId: string | null, file: File): Promise<string> => {
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

const renameNode = async (id: string, newName: string): Promise<void> => {
  const node = await db.nodes.get(id);
  if (!node) {
    return;
  }
  const existing = await listSiblingNameSet(node.roomId, node.parentId);
  // ukloni vlastito ime iz seta
  existing.delete(node.nameLower);
  const safe = ensureUniqueName(newName, existing);
  await db.nodes.update(id, {
    name: safe,
    nameLower: safe.toLowerCase(),
    updatedAt: Date.now(),
  });
};

const collectDescendantsBfs = async (rootId: string): Promise<string[]> => {
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

const deleteCascade = async (id: string): Promise<void> => {
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

const resolvePath = async (roomId: string, segments: string[]): Promise<NodeRecord | null> => {
  let parentId: string | null = null;
  let current: NodeRecord | undefined;
  for (const seg of segments) {
    const lower = seg.toLowerCase();
    current = await db.nodes
      .where({ roomId, parentId, nameLower: lower })
      .filter((n) => n.type === 'folder')
      .first();
    if (!current) {
      return null;
    }
    parentId = current.id;
  }
  return current ?? null;
};

export {
  createFile,
  createFolder,
  deleteCascade,
  getNode,
  listChildren,
  listSiblingNameSet,
  renameNode,
  resolvePath,
};
