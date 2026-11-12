-- Skema leaderboard Jangkep.
-- Jalankan sekali di Supabase: Dashboard > SQL Editor > New query > tempel isi file ini > Run.
-- Aman dijalankan ulang (memakai "if not exists" / "or replace").

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  nickname text not null check (char_length(nickname) between 2 and 20),
  -- Harus sama dengan daftar di src/lib/leaderboard/games.ts
  game text not null check (game in ('racik-masakan', 'dari-kota-mana', 'kenali-masakan')),
  -- Batas atas longgar sebagai pengaman terakhir; batas per game dicek di server.
  score integer not null check (score >= 0 and score <= 100000),
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists scores_game_score_idx on public.scores (game, score desc);
create index if not exists scores_game_nickname_idx on public.scores (game, lower(nickname));

-- RLS aktif tanpa policy: anon dan authenticated tidak bisa membaca atau menulis apa pun.
-- Akses hanya lewat server Next.js dengan secret key (role service_role melewati RLS).
alter table public.scores enable row level security;

-- 10 besar per game, satu skor terbaik per nama panggilan (nama dibandingkan tanpa beda huruf besar/kecil).
-- Kalau skornya sama, yang lebih dulu mencapai skor itu berada di atas.
create or replace function public.top_scores(p_game text, p_limit integer default 10)
returns table (nickname text, score integer, is_sample boolean, created_at timestamptz)
language sql
stable
set search_path = ''
as $$
  select best.nickname, best.score, best.is_sample, best.created_at
  from (
    select distinct on (lower(s.nickname)) s.nickname, s.score, s.is_sample, s.created_at
    from public.scores s
    where s.game = p_game
    order by lower(s.nickname), s.score desc, s.created_at asc
  ) as best
  order by best.score desc, best.created_at asc
  limit least(greatest(coalesce(p_limit, 10), 1), 50);
$$;

-- Fungsi di schema public otomatis bisa dipanggil lewat API; tutup untuk anon/authenticated.
revoke execute on function public.top_scores(text, integer) from public, anon, authenticated;
grant execute on function public.top_scores(text, integer) to service_role;
