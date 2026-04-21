import type { SourceRecord } from '../collectors/types';

export type EmotionTag = 'fear' | 'greed' | 'optimism' | 'uncertainty' | 'confidence';

export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export type ScoredSentiment = {
  label: SentimentLabel;
  score: number;
  emotionTags?: EmotionTag[];
  hitKeywords: string[];
};

type LexiconEntry = {
  weight: number;
  label: SentimentLabel;
  emotionTags?: EmotionTag[];
};

const LEXICON: Record<string, LexiconEntry> = {
  surge: { weight: 2, label: 'positive', emotionTags: ['optimism'] },
  rally: { weight: 1.8, label: 'positive', emotionTags: ['confidence'] },
  beat: { weight: 1.5, label: 'positive', emotionTags: ['confidence'] },
  upgrade: { weight: 1.4, label: 'positive', emotionTags: ['optimism'] },
  slump: { weight: -2.2, label: 'negative', emotionTags: ['fear'] },
  plunge: { weight: -2.5, label: 'negative', emotionTags: ['fear'] },
  miss: { weight: -1.6, label: 'negative', emotionTags: ['uncertainty'] },
  downgrade: { weight: -1.8, label: 'negative', emotionTags: ['fear'] },
  volatile: { weight: -0.6, label: 'neutral', emotionTags: ['uncertainty'] },
  stable: { weight: 0.5, label: 'neutral', emotionTags: ['confidence'] },
  sideways: { weight: 0.2, label: 'neutral', emotionTags: ['uncertainty'] },
};

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

export const scoreTextSentiment = (text: string): ScoredSentiment => {
  const tokens = tokenize(text);
  let total = 0;
  const emotion = new Set<EmotionTag>();
  const hits: string[] = [];

  for (const token of tokens) {
    const entry = LEXICON[token];
    if (!entry) {
      continue;
    }

    total += entry.weight;
    hits.push(token);
    entry.emotionTags?.forEach((tag) => emotion.add(tag));
  }

  let label: SentimentLabel = 'neutral';
  if (total >= 1) {
    label = 'positive';
  } else if (total <= -1) {
    label = 'negative';
  }

  return {
    label,
    score: Number(total.toFixed(3)),
    emotionTags: emotion.size > 0 ? [...emotion] : undefined,
    hitKeywords: hits,
  };
};

export const scoreRecordSentiment = (record: Pick<SourceRecord, 'text'>): ScoredSentiment =>
  scoreTextSentiment(record.text);
