-- Initial schema for stock tracking, post collection, and daily aggregates.

create table if not exists public.tracked_stocks (
  id bigserial primary key,
  stock_code text not null,
  stock_name text not null,
  market text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tracked_stocks_stock_code_key unique (stock_code)
);

create table if not exists public.collected_posts (
  id bigserial primary key,
  stock_code text not null,
  source text not null,
  external_id text,
  author text,
  title text,
  content text not null,
  content_hash text not null,
  posted_at timestamptz,
  collected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint collected_posts_stock_code_fkey
    foreign key (stock_code)
    references public.tracked_stocks (stock_code)
    on update cascade
    on delete restrict,
  constraint collected_posts_unique_stock_content unique (stock_code, content_hash)
);

create table if not exists public.daily_sentiment (
  id bigserial primary key,
  stock_code text not null,
  target_date date not null,
  post_count integer not null default 0,
  positive_count integer not null default 0,
  neutral_count integer not null default 0,
  negative_count integer not null default 0,
  sentiment_score numeric(8, 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_sentiment_stock_code_fkey
    foreign key (stock_code)
    references public.tracked_stocks (stock_code)
    on update cascade
    on delete restrict,
  constraint daily_sentiment_unique_stock_date unique (stock_code, target_date)
);

create table if not exists public.daily_price (
  id bigserial primary key,
  stock_code text not null,
  target_date date not null,
  open_price numeric(14, 4),
  high_price numeric(14, 4),
  low_price numeric(14, 4),
  close_price numeric(14, 4),
  adjusted_close_price numeric(14, 4),
  volume bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_price_stock_code_fkey
    foreign key (stock_code)
    references public.tracked_stocks (stock_code)
    on update cascade
    on delete restrict,
  constraint daily_price_unique_stock_date unique (stock_code, target_date)
);

create index if not exists tracked_stocks_stock_code_idx
  on public.tracked_stocks (stock_code);

create index if not exists tracked_stocks_is_active_idx
  on public.tracked_stocks (is_active);

create index if not exists tracked_stocks_display_order_idx
  on public.tracked_stocks (display_order);

create index if not exists collected_posts_stock_code_idx
  on public.collected_posts (stock_code);

create index if not exists collected_posts_collected_at_idx
  on public.collected_posts (collected_at desc);

create index if not exists daily_sentiment_stock_code_idx
  on public.daily_sentiment (stock_code);

create index if not exists daily_sentiment_target_date_idx
  on public.daily_sentiment (target_date desc);

create index if not exists daily_price_stock_code_idx
  on public.daily_price (stock_code);

create index if not exists daily_price_target_date_idx
  on public.daily_price (target_date desc);
