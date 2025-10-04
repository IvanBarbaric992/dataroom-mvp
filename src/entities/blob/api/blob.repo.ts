import { nanoid } from 'nanoid';

import { db } from '@/shared/lib/database';

export const createBlob = async (data: Blob): Promise<string> => {
  const id = nanoid();
  await db.blobs.add({ id, data });
  return id;
};

export const getBlob = async (id: string): Promise<Blob | undefined> => {
  const rec = await db.blobs.get(id);
  return rec?.data;
};

export const deleteBlob = async (id: string): Promise<void> => {
  await db.blobs.delete(id);
};
