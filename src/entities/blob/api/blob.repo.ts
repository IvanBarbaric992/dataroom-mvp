import { nanoid } from 'nanoid';

import { db } from '@/shared/lib/database';

const createBlob = async (data: Blob): Promise<string> => {
  const id = nanoid();
  await db.blobs.add({ id, data });
  return id;
};

const getBlob = async (id: string): Promise<Blob | undefined> => {
  const rec = await db.blobs.get(id);
  return rec?.data;
};

const deleteBlob = async (id: string): Promise<void> => {
  await db.blobs.delete(id);
};

export { createBlob, deleteBlob, getBlob };
