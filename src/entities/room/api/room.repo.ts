import { nanoid } from 'nanoid';

import type { Room } from '@/entities/room/model/types';
import { db } from '@/shared/lib/database';

/**
 * Get all rooms ordered by creation date
 * @returns Promise with array of rooms
 */
const listRooms = async (): Promise<Room[]> => {
  try {
    return await db.rooms.orderBy('createdAt').toArray();
  } catch (error) {
    console.error('Failed to list rooms:', error);
    throw new Error('Failed to retrieve rooms');
  }
};

/**
 * Create a new room
 * @param name - The name of the room
 * @returns Promise with the created room
 */
const createRoom = async (name: string): Promise<Room> => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Room name is required and must be a non-empty string');
  }

  try {
    const now = Date.now();
    const room: Room = {
      id: nanoid(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    };
    await db.rooms.add(room);
    return room;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw new Error('Failed to create room');
  }
};

/**
 * Rename an existing room
 * @param id - The room ID
 * @param name - The new name
 * @returns Promise with number of updated records
 */
const renameRoom = async (id: string, name: string): Promise<number> => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Room ID is required and must be a non-empty string');
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Room name is required and must be a non-empty string');
  }

  try {
    return await db.rooms.update(id, { name: name.trim(), updatedAt: Date.now() });
  } catch (error) {
    console.error('Failed to rename room:', error);
    throw new Error('Failed to rename room');
  }
};

/**
 * Delete a room and all its associated nodes and blobs
 * @param id - The room ID to delete
 * @returns Promise that resolves when deletion is complete
 */
const deleteRoom = async (id: string): Promise<void> => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Room ID is required and must be a non-empty string');
  }

  try {
    // Get all node IDs for this room
    const nodeIds = await db.nodes.where('roomId').equals(id).primaryKeys();

    if (nodeIds.length === 0) {
      // No nodes to delete, just delete the room
      await db.rooms.delete(id);
      return;
    }

    // Get all nodes to find associated blobs
    const nodes = await db.nodes.bulkGet(nodeIds);

    // Extract blob IDs from file nodes, filtering out null/undefined values
    const blobIds: string[] = [];
    for (const node of nodes) {
      if (node && node.type === 'file' && node.blobId && typeof node.blobId === 'string') {
        const blobId: string = node.blobId;
        blobIds.push(blobId);
      }
    }

    // Delete everything in a transaction for data consistency
    await db.transaction('rw', db.nodes, db.blobs, db.rooms, async () => {
      // Delete associated blobs if any
      if (blobIds.length > 0) {
        await db.blobs.bulkDelete(blobIds);
      }

      // Delete all nodes for this room
      if (nodeIds.length > 0) {
        await db.nodes.bulkDelete(nodeIds);
      }

      // Finally, delete the room itself
      await db.rooms.delete(id);
    });
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw new Error('Failed to delete room and its associated data');
  }
};

export { createRoom, deleteRoom, listRooms, renameRoom };
