import PocketBase from 'pocketbase';

export type Collection<T> = {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
} & T;

export const pocketbase = new PocketBase('https://admin.runtime.fm');

export const createFileUrlFromRecord = <T>(record: Collection<T>, key: keyof Collection<T>) => {
  return `https://admin.runtime.fm/api/files/${record.collectionId}/${record.id}/${record[key]}`
}
