import PocketBase from 'pocketbase';

export type Collection<T> = {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
} & T;

export const pocketbase = new PocketBase('https://api.coffeeandcode.app');

export const createFileUrlFromRecord = <T>(record: Collection<T>, key: keyof Collection<T>) => {
  return `https://api.coffeeandcode.app/api/files/${record.collectionId}/${record.id}/${record[key]}`
}
