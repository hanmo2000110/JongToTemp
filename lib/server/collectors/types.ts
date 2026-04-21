export type SourceRecord = {
  id: string;
  source: string;
  stockCode: string;
  publishedAt: string;
  text: string;
  metadata?: Record<string, unknown>;
};

export type CollectQuery = {
  targetDate: string;
  stockCode?: string;
  cursor?: string;
  limit?: number;
};

export type CollectResult = {
  records: SourceRecord[];
  nextCursor?: string;
};

export interface CollectorAdapter {
  source: string;
  collect(query: CollectQuery): Promise<CollectResult>;
}

export interface CollectorRegistry {
  register(adapter: CollectorAdapter): void;
  get(source: string): CollectorAdapter;
  list(): CollectorAdapter[];
}

export class InMemoryCollectorRegistry implements CollectorRegistry {
  private readonly adapters = new Map<string, CollectorAdapter>();

  register(adapter: CollectorAdapter): void {
    this.adapters.set(adapter.source, adapter);
  }

  get(source: string): CollectorAdapter {
    const adapter = this.adapters.get(source);
    if (!adapter) {
      throw new Error(`collector adapter not found: ${source}`);
    }
    return adapter;
  }

  list(): CollectorAdapter[] {
    return Array.from(this.adapters.values());
  }
}
