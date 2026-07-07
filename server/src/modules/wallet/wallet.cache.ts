import config from "../../config";

const CACHE_TTL_MS = 2 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();

let redisClient: any = null;

const getRedis = async (): Promise<any> => {
  if (redisClient) return redisClient;
  if (config.redisUrl) {
    try {
      const Redis = (await import("ioredis")).default;
      redisClient = new Redis(config.redisUrl);
      return redisClient;
    } catch {
      return null;
    }
  }
  return null;
};

const redisAvailable = async (): Promise<boolean> => {
  const client = await getRedis();
  return !!client;
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (await redisAvailable()) {
    try {
      const client = await getRedis();
      const raw = await client.get(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      return memoryGet<T>(key);
    }
    return null;
  }
  return memoryGet<T>(key);
};

export const cacheSet = async <T>(key: string, data: T, ttlMs: number = CACHE_TTL_MS): Promise<void> => {
  if (await redisAvailable()) {
    try {
      const client = await getRedis();
      await client.set(key, JSON.stringify(data), "PX", ttlMs);
    } catch {
      memorySet(key, data, ttlMs);
    }
    return;
  }
  memorySet(key, data, ttlMs);
};

export const cacheDel = async (key: string): Promise<void> => {
  if (await redisAvailable()) {
    try {
      const client = await getRedis();
      await client.del(key);
    } catch {
      memoryDel(key);
    }
    return;
  }
  memoryDel(key);
};

export const walletCacheKey = (userId: string): string => `wallet:${userId}`;
export const balanceCacheKey = (userId: string): string => `wallet:balance:${userId}`;

const memoryGet = <T>(key: string): T | null => {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.data;
};

const memorySet = <T>(key: string, data: T, ttlMs: number): void => {
  memoryStore.set(key, { data, expiresAt: Date.now() + ttlMs });
};

const memoryDel = (key: string): void => {
  memoryStore.delete(key);
};
