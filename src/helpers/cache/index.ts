import * as idb from "idb-keyval";
import CacheRecord from "./IDBCache";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { RepoData } from "../../App";

const version = 1;

const daysBeforeExpires = 1;

export interface CacheKeyMap {
  repoDataArr: RepoData[],
}

export type CacheKey = keyof CacheKeyMap;

async function get<K extends keyof CacheKeyMap, T extends CacheKeyMap[K]>(
  key: K
): Promise<Optional<T>> {
  const record: CacheRecord<T> | undefined = await idb.get(key);

  if (!record) {
    return makeFailed("No cached data");
  }

  if (record.version !== version) {
    await idb.del(key);
    return makeFailed("Cache version outdated");
  }

  const now = new Date();

  if (now > record.expires) {
    await idb.del(key);
    return makeFailed("Data expired");
  }

  return makeSuccessful(record.value);
}

async function set<K extends keyof CacheKeyMap, T extends CacheKeyMap[K]>(
  key: K,
  value: T
) {
  const expires = new Date()
  expires.setDate(expires.getDate() + daysBeforeExpires)
  const cacheValue: CacheRecord<T> = {
    expires,
    version,
    value,
  };
  return idb.set(key, cacheValue);
}

async function del<K extends keyof CacheKeyMap>(key: K) {
  return idb.del(key);
}

async function clear() {
  return idb.clear();
}

export { get, set, del, clear };
