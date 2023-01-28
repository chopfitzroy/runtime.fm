import PocketBase from 'pocketbase';

export const pocketbase = new PocketBase('https://api.coffeeandcode.app');

export type Collection<T> = {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
} & T;
