export type IdempotencyStore = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
};

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly state = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.state.get(key);
    if (!item) {
      return null;
    }

    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.state.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.state.set(key, { value, expiresAt });
  }
}

export const buildExecutionKey = (prefix: string, targetDate: string, stockCode?: string) =>
  [prefix, targetDate, stockCode ?? 'ALL'].join(':');

export const withIdempotency = async <T>(
  params: {
    key: string;
    store: IdempotencyStore;
    ttlSeconds?: number;
    inProgressValue?: string;
    doneValue?: string;
  },
  callback: () => Promise<T>,
): Promise<{ skipped: boolean; result?: T }> => {
  const inProgressValue = params.inProgressValue ?? 'IN_PROGRESS';
  const doneValue = params.doneValue ?? 'DONE';

  const current = await params.store.get(params.key);
  if (current === inProgressValue || current === doneValue) {
    return { skipped: true };
  }

  await params.store.set(params.key, inProgressValue, params.ttlSeconds);
  try {
    const result = await callback();
    await params.store.set(params.key, doneValue, params.ttlSeconds);
    return { skipped: false, result };
  } catch (error) {
    await params.store.set(params.key, `FAILED:${new Date().toISOString()}`, params.ttlSeconds);
    throw error;
  }
};

export const withRetry = async <T>(
  task: () => Promise<T>,
  options?: { retries?: number; delayMs?: number },
): Promise<T> => {
  const retries = options?.retries ?? 2;
  const delayMs = options?.delayMs ?? 500;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('retry failed with unknown error');
};
