'use client';

import { FormEvent, useMemo, useState } from 'react';
import { stockItems, type StockItem } from '@/lib/mock/dashboard';

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockItem[]>(stockItems);
  const [query, setQuery] = useState('');
  const [codeInput, setCodeInput] = useState('');

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase();
    if (!key) return stocks;
    return stocks.filter((item) => `${item.name}${item.code}${item.memo}`.toLowerCase().includes(key));
  }, [stocks, query]);

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const code = codeInput.trim();
    if (!code) return;

    if (stocks.some((item) => item.code === code)) {
      setCodeInput('');
      return;
    }

    setStocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), code, name: `신규 종목 ${code}`, active: true, memo: '' },
    ]);
    setCodeInput('');
  };

  const updateStock = (id: string, updater: (item: StockItem) => StockItem) => {
    setStocks((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const removeStock = (id: string) => setStocks((prev) => prev.filter((item) => item.id !== id));

  const move = (id: string, direction: -1 | 1) => {
    setStocks((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;

      const copied = [...prev];
      [copied[index], copied[target]] = [copied[target], copied[index]];
      return copied;
    });
  };

  return (
    <main className="mx-auto flex h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col gap-4 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="stockQuery" className="mb-1 block text-sm font-medium text-slate-700">
              종목 검색
            </label>
            <input
              id="stockQuery"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="종목명, 코드, 메모 검색"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-base focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor="stockCode" className="mb-1 block text-sm font-medium text-slate-700">
              코드 입력
            </label>
            <input
              id="stockCode"
              value={codeInput}
              onChange={(event) => setCodeInput(event.target.value)}
              placeholder="예: 005930"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-base focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-lg bg-blue-600 px-4 text-base font-semibold text-white hover:bg-blue-700"
          >
            등록
          </button>
        </form>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <ul className="space-y-3">
          {filtered.map((item, index) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-500">{item.code}</p>
                  <p className="truncate text-lg font-semibold text-slate-900">{item.name}</p>
                  <input
                    value={item.memo}
                    onChange={(event) =>
                      updateStock(item.id, (prev) => ({
                        ...prev,
                        memo: event.target.value,
                      }))
                    }
                    placeholder="메모 입력"
                    className="mt-2 h-10 w-full rounded-md border border-slate-300 px-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStock(item.id, (prev) => ({ ...prev, active: !prev.active }))}
                    className={`h-10 rounded-md px-3 text-sm font-medium text-white ${
                      item.active ? 'bg-emerald-600' : 'bg-slate-500'
                    }`}
                  >
                    {item.active ? '활성' : '비활성'}
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.id, -1)}
                    disabled={index === 0}
                    className="h-10 rounded-md border border-slate-300 px-3 text-sm disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.id, 1)}
                    disabled={index === filtered.length - 1}
                    className="h-10 rounded-md border border-slate-300 px-3 text-sm disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStock(item.id)}
                    className="h-10 rounded-md bg-rose-600 px-3 text-sm font-medium text-white"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
