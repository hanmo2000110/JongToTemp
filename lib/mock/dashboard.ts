export type DailyMetric = {
  date: string;
  closePrice: number;
  negativeRatio: number;
  postVolume: number;
  sentimentIndex: number;
};

export type StockItem = {
  id: string;
  code: string;
  name: string;
  active: boolean;
  memo: string;
};

export const stockItems: StockItem[] = [
  { id: '1', code: '005930', name: '삼성전자', active: true, memo: '반도체 업황 민감' },
  { id: '2', code: '000660', name: 'SK하이닉스', active: true, memo: 'HBM 이슈 추적' },
  { id: '3', code: '035420', name: 'NAVER', active: false, memo: 'AI 서비스 반응 체크' },
  { id: '4', code: '051910', name: 'LG화학', active: true, memo: '배터리 수요 관찰' },
];

export const marketSeriesByStock: Record<string, DailyMetric[]> = {
  '005930': [
    { date: '04-08', closePrice: 80700, negativeRatio: 31, postVolume: 1280, sentimentIndex: 61 },
    { date: '04-09', closePrice: 81200, negativeRatio: 29, postVolume: 1320, sentimentIndex: 62 },
    { date: '04-10', closePrice: 80900, negativeRatio: 35, postVolume: 1410, sentimentIndex: 58 },
    { date: '04-11', closePrice: 81800, negativeRatio: 28, postVolume: 1360, sentimentIndex: 64 },
    { date: '04-12', closePrice: 82200, negativeRatio: 26, postVolume: 1250, sentimentIndex: 67 },
    { date: '04-13', closePrice: 81900, negativeRatio: 27, postVolume: 1200, sentimentIndex: 66 },
    { date: '04-14', closePrice: 82600, negativeRatio: 24, postVolume: 1500, sentimentIndex: 70 },
    { date: '04-15', closePrice: 83200, negativeRatio: 23, postVolume: 1610, sentimentIndex: 72 },
    { date: '04-16', closePrice: 82900, negativeRatio: 25, postVolume: 1470, sentimentIndex: 69 },
    { date: '04-17', closePrice: 83800, negativeRatio: 22, postVolume: 1700, sentimentIndex: 74 },
    { date: '04-18', closePrice: 84100, negativeRatio: 21, postVolume: 1680, sentimentIndex: 76 },
    { date: '04-19', closePrice: 84500, negativeRatio: 20, postVolume: 1750, sentimentIndex: 77 },
    { date: '04-20', closePrice: 84800, negativeRatio: 19, postVolume: 1800, sentimentIndex: 79 },
    { date: '04-21', closePrice: 85200, negativeRatio: 18, postVolume: 1860, sentimentIndex: 81 },
  ],
  '000660': [
    { date: '04-08', closePrice: 183000, negativeRatio: 33, postVolume: 940, sentimentIndex: 56 },
    { date: '04-09', closePrice: 185500, negativeRatio: 31, postVolume: 1000, sentimentIndex: 59 },
    { date: '04-10', closePrice: 184000, negativeRatio: 34, postVolume: 980, sentimentIndex: 57 },
    { date: '04-11', closePrice: 188000, negativeRatio: 30, postVolume: 1100, sentimentIndex: 62 },
    { date: '04-12', closePrice: 189500, negativeRatio: 29, postVolume: 1170, sentimentIndex: 64 },
    { date: '04-13', closePrice: 191000, negativeRatio: 27, postVolume: 1210, sentimentIndex: 66 },
    { date: '04-14', closePrice: 192500, negativeRatio: 25, postVolume: 1290, sentimentIndex: 68 },
    { date: '04-15', closePrice: 194000, negativeRatio: 24, postVolume: 1330, sentimentIndex: 70 },
    { date: '04-16', closePrice: 193000, negativeRatio: 26, postVolume: 1200, sentimentIndex: 67 },
    { date: '04-17', closePrice: 196500, negativeRatio: 23, postVolume: 1420, sentimentIndex: 72 },
    { date: '04-18', closePrice: 198000, negativeRatio: 22, postVolume: 1450, sentimentIndex: 74 },
    { date: '04-19', closePrice: 199500, negativeRatio: 21, postVolume: 1510, sentimentIndex: 75 },
    { date: '04-20', closePrice: 201000, negativeRatio: 20, postVolume: 1580, sentimentIndex: 77 },
    { date: '04-21', closePrice: 203500, negativeRatio: 19, postVolume: 1620, sentimentIndex: 79 },
  ],
};
