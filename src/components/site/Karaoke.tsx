'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useMusicPlayer } from '@/components/site/MusicPlayerContext';

/* ── Hardcoded song data ─────────────────────────────────────────────────── */

const ACCENT = '#e4f222';
const PICKER_LYRIC_PREVIEW_LINES = 8;
const PLAYER_LYRIC_WINDOW_LINES = 11;

const SONGS = [
  {
    title: 'iPod Touch',
    artist: 'Ninajirachi',
    src: '/media/music/ipod-touch-ninajirachi.m4a',
    cover: '/media/covers/iPod%20Touch_track_cover.jpg',
    lyrics: [
      "I've got a song that nobody knows",
      "I put it on when nobody's home",
      'It sounds like high school, front gate, smoke in my face',
      'It sounds like dyed, frayed, high-waist, bought at Supré',
      "It sounds like lovin' you is easy but they boosted the bass",
      '(It sounds like)',
      'It sounds like iPod Touch, yellow Pikachu case',
      '"FL Studio free download" in my search history',
      "Hidden underneath my pillow 'cause I should be asleep",
      '(It sounds like)',
      "I'm keepin' it a secret, it sounds like",
      "I've got a song that nobody knows",
      'And I heard it in a post when I was twelve years old',
      "I didn't know it would score the 64-bus home",
      'Turn a Monday to a memory and change my world',
      'It sounds like iPod Touch, little crack in thе screen',
      'FL Studio so late, I fell asleep on the kеys',
      "With it loopin' through the speakers, bleedin' into my dreams (It sounds like)",
      'It sounds like',
      "I've got a song that nobody knows",
      'And I heard it in a post when I was twelve years old',
      "I didn't know it would score the 64-bus home",
      'Turn a Monday to a memory and change my world',
      "It sounds like first day, hallway, startin' year eight",
      'It sounds like beach day, heatwave, stoned, and afraid',
      "It sounds like me and my computer hangin' out until late (It sounds like)",
      'It sounds like iPod Touch, yellow Pikachu case',
      '"FL Studio free download" in my search history',
      "Hidden underneath my pillow 'cause I should be asleep (It sounds like)",
      'It sounds like',
      "I'm keepin' it a secret, it sounds like",
    ],
  },
  {
    title: 'Dracula (JENNIE Remix)',
    artist: 'Tame Impala & JENNIE',
    src: '/media/music/Dracula%20-%20Jennie%20Remix%20-%20Tame%20Impala%20Jennie.m4a',
    cover: '/media/covers/Dracula_track_cover.jpg',
    lyrics: [
      'Oh (You and me)',
      'Oh (Hahaha)',
      '(Check it out now)',
      '(Hahaha, mm)',
      '(Dracula)',
      '(Ba-da-bing, ba-da-boom)',
      '(Dracula)',
      'The morning light is turning blue, the feeling is bizarre (Bizarre)',
      "The night is almost over, I still don't know where you are",
      'The shadows, yeah, they keep me pretty like a movie star',
      'Daylight makes me feel like Dracula (Dracula)',
      "In the end, I hope it's you and me (You and me)",
      "In the darkness, I would never leave (Never leave)",
      "You won't ever see me in the light of day",
      "It's far too late, the time has come",
      "I'm on the verge of caving in, I run back to the dark (Dark)",
      "Now I'm Mr. Charisma, fuckin' Pablo Escobar",
      'My friends are saying, "Shut up, Jennie, just get in the car"',
      '(Hahaha; Jennie)',
      'I just wanna be right where you are (Oh, my love)',
      "In the end, I hope it's you and me (You and me)",
      "In the darkness, I would never leave (Never leave; I won't leave her)",
      "We both saw this moment comin' from afar (Comin' from afar)",
      'Now here we are (Here we are)',
      'Run from the sunlight, Dracula',
      'Run from the sunlight, Dracula',
      'Run from the sunlight, Dracula (Run from the sun)',
      "Isn't the view spectacular? (Dracula; Dracula)",
      "Hey, Kevin, what's up? (Haha)",
      'Come pull up in my spot',
      "Let's keep the night glowing",
      "I don't ever wanna stop (Hahaha)",
      "I'll never leave this floor, got me needin' more (Oh)",
      'Sky is turning blue, let it clear the smoke',
      "Lip-stain on the rim, bass is 'bout to blow (Oh)",
      'Sinking in my teeth, I buy time',
      "But please, do you think about what it might mean? (Mean)",
      "'Cause I dream about you in my sleep",
      'Would you ever love someone like me (Someone like me)',
      'Like me? (Oh)',
      "In the end, I hope it's you and me (Oh, my love)",
      "In the darkness, I would never leave",
      "We both saw this moment comin' from afar (Comin' from afar)",
      'Now here we are (Here we are)',
      'So run from the sunlight, Dracula',
      'So run from the sunlight, Dracula',
      'Run from the sunlight, Dracula',
      "Isn't the view spectacular?",
      'So run from the sunlight, Dracula',
      'Run from the sunlight, Dracula',
      "Isn't the view spectacular? (Run from the sunlight, Dracula)",
      'Run from the sunlight, Dracula (Run from the sunlight, Dracula)',
      'Run from the sunlight, Dracula (Run from the sunlight, Dracula)',
      "Isn't the view spectacular?",
    ],
  },
  {
    title: 'BUMPA',
    artist: 'BIBI',
    src: '/media/music/Bumpa%20-%20Bibi.m4a',
    cover: '/media/covers/BUMPA_track_cover.jpg',
    lyrics: [
      'Dance for me',
      'Dance for me, you got me papi',
      'Dance for me',
      'The ocean breeze blowing over there',
      'Makes the waves dance along',
      'You got me dancing, dance for me',
      'Give it to me papi, yeah',
      'Yeah',
      'Dance, dance, yeah',
      'Dancing like no tomorrow',
      'Summer time, summer time',
      'Girls looking pretty',
      'Pop the bottle up, face down',
      'You and I are a little busy',
      'Keep the base up, face down',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Paw, paw, paw, paw, paw, paw, paw, paw, paw',
      'Yeah, yuh, BIBI in hurry',
      'Today seems like the end',
      'Making love, nothing else to do on a hot day',
      'So we dancing like ooh-ah',
      "The music's getting heavy",
      'So you got the move',
      'Baby, I got one too',
      'Move for me one',
      'Dance, dance, yeah',
      'Dancing like no tomorrow',
      'Summer time, summer time',
      'Girls looking pretty',
      'Pop the bottle up, face down',
      'You and I are a little busy',
      'Keep the base up, face down',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Paw, paw, paw, paw, paw, paw, paw, paw, paw',
      'Dance for me',
      'Dance for me, you got me papi',
      'Dance for me',
      'The ocean breeze blowing over there',
      'Makes the waves dance along',
      'You got me dancing, dance for me',
      'Give it to me papi',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'One more time, no two more times',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Paw, paw, paw, paw, paw, paw, paw, paw, paw',
      'Yeah',
      'Bum, bum, bum, bum, bum, bum, ooh',
      'La-la-la-la, yes',
      'Ah-ah-ah-ah-ah, ooh, yeah',
      "Mm, mm, let's go",
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Bump my bumpa',
      'Paw, paw, paw, paw, paw, paw, paw, paw, paw',
      'Thank you',
    ],
  },
  {
    title: "Stayin' Alive",
    artist: 'Avu-chan',
    src: '/media/music/Stayin%20Alive%20-%20Avu-chan.m4a',
    cover: "/media/covers/Stayin'%20Alive_track_cover.jpg",
    lyrics: [
      '歩き方でわかるだろ',
      'そうさ 男ってところ',
      'Music loud 女もかなりしたぜ苦労を',
      'でもいいさ it\'s okay',
      '見て見ぬ振りして',
      'わかった顔で The New York Times のせいだね',
      '兄貴 兄弟もオフクロも',
      'Yo, stayin\' alive, stayin\' alive',
      '街が震えてみんなが揺れては stayin\' alive',
      'Stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive, stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive, stayin\' alive',
      'さあゆこう',
      '無機質でも仕方ない',
      '中途半端でも I really try',
      '天国誘う靴 I\'m a dancin\' man',
      '負け知らず それでもいいさ it\'s okay',
      '見て見ぬ振りして',
      'わかった顔で The New York Times のせいだね',
      '兄貴 兄弟もオフクロも',
      'Yo, stayin\' alive, stayin\' alive',
      '街が震えてみんなが揺れては stayin\' alive',
      'Stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive, stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive',
      'Ah, ah, ah, ah, ah',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ (I\'ll think about it)',
      '歩き方でわかるだろ',
      'そうさ 男ってところ',
      'Music loud 女もかなりしたぜ苦労を',
      'でもいいさ it\'s okay',
      '見て見ぬ振りして',
      'わかった顔で The New York Times のせいだね',
      '兄貴 兄弟もオフクロも',
      'Yo, stayin\' alive, stayin\' alive',
      '街が震えてみんなが揺れては stayin\' alive',
      'Stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive, stayin\' alive',
      'Ah, ha, ha, ha, stayin\' alive, stayin\' alive',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ (I\'ll think about it)',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ (I\'ll think about it)',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ',
      '行き止まり somebody help me',
      '助けてくれ 行き止まり',
      '助けてくれ',
    ],
  },
  {
    title: 'TELEPATHY LOVE',
    artist: 'BNYX® feat. Clara La San',
    src: '/media/music/Telepathy%20Love%20feat%20Clara%20La%20San%20-%20Bnyx%20Clara%20La%20San.m4a',
    cover: '/media/covers/TELEPATHY%20LOVE%20(feat.%20Clara%20La%20San)_track_cover.jpg',
    lyrics: [
      'You know all the signs with me',
      'You\'re telepathic and it\'s turnin\' me on',
      'Your love, it cuts much deeper',
      'You say you understand my mind all day long',
      'So can you hear what I\'m sayin\'? Tell myself when I\'m alone',
      'And if you know that I\'m cryin\', will you be ringin\' my phone?',
      'And if I\'m ever in trouble or somethin\' happens, who knows?',
      'Would you be there, there, there with me? Mentally, physically, no',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You say you understand my mind all day long',
      'Telepathy love, l-l-love, l-l-l-love',
      'Telepathy love, l-l-love, l-l-l-love',
      'Love, l-l-l-love',
      'Telepathy love',
      'L-l-love, l-l-l-love',
      'Love, l-l-l-love',
      'So can you hear what I\'m sayin\'? Tell myself when I\'m alone',
      'And if you know that I\'m cryin\', will you be ringin\' my phone?',
      'And if I\'m ever in trouble or somethin\' happens, who knows?',
      'Would you be there, there, there with me? Mentally, physically, no',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You say you understand my mind all day long',
      'Telepathy love',
      'L-l-love, l-l-l-love, l-l-l-love',
      'You know all the signs with me',
      'You\'re telepathic and it\'s turnin\' me on',
      'Your love, it cuts much deeper',
      'You say you understand my mind all day long',
      'So can you hear what I\'m sayin\'? Tell myself when I\'m alone',
      'And if you know that I\'m cryin\', will you be ringin\' my phone?',
      'And if I\'m ever in trouble or somethin\' happens, who knows?',
      'Would you be there, there, there with me? Mentally, physically, no',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You\'re telepathic and it\'s turnin\' me on',
      'Telepathy love',
      'You say you understand my mind all day long',
      'Telepathy love',
      'L-l-love, l-l-l-love, love',
      'You\'re telepathic and it\'s turnin\' me on',
      'L-l-love, l-l-l-love, love',
      'You\'re telepathic and it\'s turnin\' me on',
      'L-l-love, l-l-l-love, love',
      'You say you understand my mind all day long',
      'L-l-love, l-l-l-love, love',
      'You\'re telepathic and it\'s turnin\' me on',
    ],
  },
  {
    title: 'Chicago',
    artist: 'Michael Jackson',
    src: '/media/music/Chicago%20-%20Michael%20Jackson.m4a',
    cover: '/media/covers/Chicago_track_cover.jpg',
    lyrics: [
      "I met her on my way to Chicago",
      "Where she was all alone and so was I",
      "So I asked her for her name",
      "She smiled and looked at me",
      "I was surprised to see",
      "That a woman like that was really into me",
      "She said she didn't have no man",
      "Raised the kids the very best she can (She was lovin' me)",
      "She told me she was all alone",
      "Said, \"I don't,\" she didn't have no phone (She was wantin' me)",
      "She said just to give her a page",
      "Fifty nine was the code she gave (She was lovin' me)",
      "She'd lied to you, lied to me",
      "'Cause she was lovin' me, lovin' me, yeah",
      "I never would've thought she was livin' like that",
      "Her words seemed so sincere",
      "When I held her near, she would tell me how she feels",
      "It felt so real to me",
      "This girl, she had to be",
      "An angel sent from heaven just for me",
      "She said she didn't have no man",
      "Raised the kids the very best she can (Look, she's lovin' me)",
      "She told me she was all alone",
      "Said, \"I don't,\" she didn't have no phone (She was lovin' me)",
      "She said just to give her a page",
      "Fifty nine was the code she gave",
      "She'd lied to you, lied to me",
      "'Cause she was lovin' me, lovin' me, yeah (Look who's lovin' me)",
      "She tried to live a double life",
      "Lovin' me while she was still your wife (She was wantin' me)",
      "She thought that lovin' me was cool",
      "With you at work and the kids at school (She was lovin' me)",
      "She said that it would never end",
      "Or tried to keep me any way she can (She was wantin' me)",
      "She'd lied to you, lied to me",
      "'Cause she got a family, family, yeah",
      "Whoa, no",
      "Alright",
      "Oh (I'm in love, love)",
      "I didn't know she was already spoken for",
      "'Cause I'm not that kind of man",
      "Swear that I would've never looked her way",
      "Now I feel so much shame",
      "And all things have to change",
      "You should know that I'm holdin' her to blame",
      "She said she didn't have no man",
      "Raised the kids the very best she can (Holdin' her to blame)",
      "She told me she was all alone",
      "Said, \"I don't,\" she didn't have no phone (Holdin' her to blame)",
      "She said just to give her a page",
      "Fifty nine was the code she gave (Holdin' her to blame)",
      "She'd lied to you, lied to me",
      "'Cause she was lovin' me, lovin' me, yeah (Holdin' her to blame)",
      "She tried to live a double life",
      "Loving me while she was still your wife (Holdin' her to blame)",
      "She thought that loving me was cool",
      "With you at work and the kids at school (Holdin' her to blame)",
      "She said that it would never end",
      "Or tried to keep me any way she can (Holdin' her to blame)",
      "She'd lied to you, lied to me",
      "'Cause she got a family, family, yeah",
      "She said she didn't have no man",
      "Raised the kids the very best she can (Look, she's lovin' me)",
      "She told me she was all alone",
      "Said, \"I don't,\" she didn't have no phone (She was lovin' me)",
      "She said just to give her a page",
      "Fifty nine was the code she gave (She's with me)",
      "She'd lied to you, lied to me",
      "'Cause she was lovin' me, lovin' me, yeah (Look who's lovin' me)",
      "She tried to live a double life",
      "Lovin' me while she was still your wife (She was wantin' me)",
      "She thought that lovin' me was cool",
      "With you at work and the kids at school (She was lovin' me)",
      "She said that it would never end",
      "Or tried to keep me any way she can (She was wantin' me)",
      "She'd lied to you, lied to me",
      "'Cause she got a family, family, yeah",
    ],
  },
  {
    title: 'Father Stretch My Hands, Pt. 1',
    artist: 'Kanye West',
    src: '/media/music/Father%20Stretch%20My%20Hands%20Pt%201%20-%20Kanye%20West.m4a',
    cover: '/media/covers/Father%20Stretch%20My%20Hands%20Pt.%201_track_cover.jpg',
    lyrics: [
      "You're the only power (Power)",
      "You're the only power that can",
      "You're the only power (Power)",
      "You're the only power that can",
      "Fa (Fa), fa (Fa), fa (Fa)",
      "Father",
      "If young Metro don't trust you I'm gon' shoot you",
      "Beautiful morning, you're the sun in my morning babe",
      "Nothing unwanted",
      "Beautiful morning, you're the sun in my morning babe",
      "Nothing unwanted",
      "I just wanna feel liberated, I, I, I",
      "I just wanna feel liberated, I, I, I",
      "If I ever instigated, I am sorry",
      "Tell me who in here can relate, I, I, I",
      "Now if I fuck this model",
      "And she just bleached her asshole",
      "And I get bleach on my T-shirt",
      "I'mma feel like an asshole",
      "I was high when I met her",
      "We was down in Tribeca",
      "She get under your skin if you let her",
      "She get under your skin if you, uh",
      "I don't even wanna talk about it",
      "I don't even wanna talk about it",
      "I don't even wanna say nothing",
      "Everybody gon' say something",
      "I'd be worried if they said nothing",
      "Remind me where I know you from",
      "She looking like she owe you some",
      "You know just what we want",
      "(I wanna wake up with you in my eyes)",
      "Beautiful morning, you're the sun in my morning babe",
      "Nothing unwanted",
      "Beautiful morning, you're the sun in my morning babe",
      "Nothing unwanted",
      "I just wanna feel liberated, I, I, I",
      "I just wanna feel liberated, I, I, I",
      "If I ever instigated, I am sorry",
      "Tell me who in here can relate, I, I, I",
    ],
  },
];

type SyncedLine = { timestamp: number; text: string };

/* ── Utilities ───────────────────────────────────────────────────────────── */

function lrcToMs(lrcTimestamp: string): number {
  const match = lrcTimestamp.match(/\[(\d+):(\d+(?:\.\d+)?)\]/);
  if (!match) return 0;
  const [, mins, secs] = match;
  return Math.round(parseFloat(mins) * 60000 + parseFloat(secs) * 1000);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[​‌‍]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na.length || !nb.length) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;
  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  let matched = 0;
  for (const word of shorter.split(' ')) {
    if (longer.includes(word)) matched += word.length;
  }
  return matched / longer.length;
}

/**
 * Match LRCLIB synced lines to the hardcoded lyric array. Each hardcoded line
 * is used at most once and matching proceeds in DOM order so repeated choruses
 * map to the correct occurrences.
 */
function matchLyrics(hardcoded: string[], synced: SyncedLine[]): SyncedLine[] {
  const used = new Set<number>();
  const result: SyncedLine[] = [];
  let cursor = 0;

  for (const line of synced) {
    let bestIndex = -1;
    let bestScore = 0.35;
    const windowEnd = Math.min(cursor + 8, hardcoded.length);
    for (let i = cursor; i < windowEnd; i++) {
      if (used.has(i)) continue;
      const score = similarity(hardcoded[i]!, line.text);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    if (bestIndex === -1) continue;
    used.add(bestIndex);
    result.push({ timestamp: line.timestamp, text: hardcoded[bestIndex]! });
    cursor = bestIndex;
  }

  return result.sort((a, b) => a.timestamp - b.timestamp);
}

async function fetchLrclib(artist: string, track: string): Promise<SyncedLine[] | null> {
  const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`;
  try {
    const res = await fetch(url, { headers: { 'Lrclib-Client': 'portfolio-karaoke/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.syncedLyrics || typeof data.syncedLyrics !== 'string') return null;
    const parsed = data.syncedLyrics
      .split('\n')
      .map((l: string) => {
        const m = l.trim().match(/^(\[\d+:\d+\.\d+\])\s*(.*)$/);
        if (!m) return null;
        return { timestamp: lrcToMs(m[1]), text: m[2].trim() };
      })
      .filter(Boolean) as SyncedLine[];
    return parsed;
  } catch {
    return null;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getItemStyle(d: number) {
  if (Math.abs(d) > 2) {
    return { opacity: 0, pointerEvents: 'none' as const, visibility: 'hidden' as const };
  }

  // Keep neighbouring covers outside the selected sleeve's silhouette. At the
  // previous stride their projected edges overlapped once the cylinder tilt was
  // applied, making them appear to cut through the active artwork.
  const itemStride = 340;
  const scale = d === 0 ? 1 : Math.abs(d) === 1 ? 0.78 : 0.58;
  const opacity = d === 0 ? 1 : Math.abs(d) === 1 ? 0.5 : 0.22;
  const blur = Math.abs(d) === 0 ? 0 : Math.abs(d) === 1 ? 4 : 9;
  const rotateX = d * 22;
  const translateZ = d === 0 ? 0 : Math.abs(d) === 1 ? -60 : -140;
  const yOffset = d * itemStride;

  return {
    transform: `translateY(calc(-50% + ${yOffset}px)) scale(${scale}) rotateX(${-rotateX}deg) translateZ(${translateZ}px)`,
    opacity,
    filter: blur > 0 ? `blur(${blur}px)` : 'none',
    transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: d === 0 ? ('auto' as const) : ('none' as const),
    zIndex: 10 - Math.abs(d),
  };
}

/* ── Component ───────────────────────────────────────────────────────────── */

type KaraokeProps = {
  onClose: () => void;
};

export default function Karaoke({ onClose }: KaraokeProps) {
  const { audioRef: backgroundAudioRef } = useMusicPlayer();
  const [view, setView] = useState<'picker' | 'player'>('picker');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [synced, setSynced] = useState<SyncedLine[] | null>(null);
  const [syncedLoaded, setSyncedLoaded] = useState(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [seekFlash, setSeekFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const scrollLock = useRef(false);
  const postLockDrain = useRef(false);
  const currentBgRef = useRef(SONGS[0]!.cover);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimeout = useRef<number | null>(null);
  const previewFadeTimeoutRef = useRef<number | null>(null);
  const previewFadeIntervalRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const countdownSongIndexRef = useRef(0);
  const [displayedSongIndex, setDisplayedSongIndex] = useState(0);
  const [isPickerSongInfoVisible, setIsPickerSongInfoVisible] = useState(true);
  const [currentBg, setCurrentBg] = useState(SONGS[0]!.cover);
  const [prevBg, setPrevBg] = useState(SONGS[0]!.cover);
  const [isCurrentBgVisible, setIsCurrentBgVisible] = useState(true);
  const [isPrevBgVisible, setIsPrevBgVisible] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);

  const currentSong = currentSongIndex != null ? SONGS[currentSongIndex] : null;
  const displayedPickerSong = SONGS[displayedSongIndex]!;

  /* ── Stop the site player before the picker can paint ──────────────────── */
  useLayoutEffect(() => {
    const backgroundAudio = backgroundAudioRef.current;
    if (!backgroundAudio) return;

    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }, [backgroundAudioRef]);

  /* ── Audio event wiring ───────────────────────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.src;
    audio.load();

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onErr = () => {
      setIsPlaying(false);
      setError('Audio file could not be loaded.');
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onErr);

    audio.play().catch(() => {
      setError('Press SPACE to play — autoplay was blocked.');
    });

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onErr);
      audio.pause();
      audio.removeAttribute('src');
    };
  }, [currentSong]);

  /* ── Fetch synced lyrics when a song is selected ────────────────────────── */
  useEffect(() => {
    if (!currentSong) return;
    let cancelled = false;

    fetchLrclib(currentSong.artist, currentSong.title)
      .then((raw) => {
        if (cancelled) return;
        if (!raw) {
          setSyncedLoaded(true);
          return;
        }
        const matched = matchLyrics(currentSong.lyrics, raw);
        setSynced(matched.length ? matched : null);
        setSyncedLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setSyncedLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [currentSong]);

  /* ── Sample dominant color from cover ───────────────────────────────────── */
  useEffect(() => {
    if (!currentSong) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const x = Math.floor(canvas.width / 2);
      const y = Math.floor(canvas.height / 2);
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      setDominantColor(`rgba(${r}, ${g}, ${b}, 0.55)`);
    };
    img.onerror = () => setDominantColor('rgba(228, 242, 34, 0.25)');
    img.src = currentSong.cover;
  }, [currentSong]);

  /* ── Active lyric index ─────────────────────────────────────────────────── */
  const activeIndex = useMemo(() => {
    if (!currentSong) return -1;
    const ms = currentTime * 1000;
    if (synced?.length) {
      let idx = -1;
      for (let i = 0; i < synced.length; i++) {
        if (synced[i]!.timestamp <= ms) idx = i;
        else break;
      }
      return idx;
    }
    if (duration > 0) {
      const idx = Math.floor((currentTime / duration) * currentSong.lyrics.length);
      return Math.min(idx, currentSong.lyrics.length - 1);
    }
    return 0;
  }, [currentSong, currentTime, duration, synced]);

  /* ── Keyboard controls ──────────────────────────────────────────────────── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const next = Math.max(0, Math.min(audio.duration, audio.currentTime + deltaSeconds));
    audio.currentTime = next;
    setCurrentTime(next);
    setSeekFlash(deltaSeconds > 0 ? `→ +${deltaSeconds}s` : `← ${deltaSeconds}s`);
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setSeekFlash(null), 700);
  }, []);

  const stopPreview = useCallback(() => {
    if (previewTimeout.current != null) {
      window.clearTimeout(previewTimeout.current);
      previewTimeout.current = null;
    }
    if (previewFadeTimeoutRef.current != null) {
      window.clearTimeout(previewFadeTimeoutRef.current);
      previewFadeTimeoutRef.current = null;
    }
    if (previewFadeIntervalRef.current != null) {
      window.clearInterval(previewFadeIntervalRef.current);
      previewFadeIntervalRef.current = null;
    }

    const previewAudio = previewAudioRef.current;
    if (!previewAudio) return;
    previewAudio.volume = 0;
    previewAudio.pause();
    previewAudioRef.current = null;
  }, []);

  const selectSong = useCallback((index: number) => {
    stopPreview();
    setSelectedIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setSynced(null);
    setSyncedLoaded(false);
    setDominantColor(null);
    setCurrentSongIndex(index);
    setView('player');
  }, [stopPreview]);

  const moveSelectedIndex = useCallback((direction: 1 | -1) => {
    stopPreview();
    setSelectedIndex((index) => (index + direction + SONGS.length) % SONGS.length);
  }, [stopPreview]);

  const cancelCountdown = useCallback(() => {
    if (countdownIntervalRef.current != null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdownValue(null);
    stopPreview();
  }, [stopPreview]);

  const startCountdown = useCallback(() => {
    stopPreview();
    if (countdownIntervalRef.current != null) {
      window.clearInterval(countdownIntervalRef.current);
    }

    countdownSongIndexRef.current = selectedIndex;
    let nextValue = 3;
    setCountdownValue(nextValue);
    countdownIntervalRef.current = window.setInterval(() => {
      nextValue -= 1;
      if (nextValue === 0) {
        if (countdownIntervalRef.current != null) {
          window.clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCountdownValue(null);
        selectSong(countdownSongIndexRef.current);
        return;
      }
      setCountdownValue(nextValue);
    }, 1000);
  }, [selectedIndex, selectSong, stopPreview]);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const absY = Math.abs(event.deltaY);

    if (postLockDrain.current) {
      if (absY < 8) postLockDrain.current = false;
      return;
    }

    if (scrollLock.current) return;
    if (absY < 12) return;

    const direction = event.deltaY > 0 ? 1 : -1;
    scrollLock.current = true;
    postLockDrain.current = false;
    moveSelectedIndex(direction);

    window.setTimeout(() => {
      scrollLock.current = false;
      postLockDrain.current = true;
    }, 320);
  }, [moveSelectedIndex]);

  /* ── Play a quiet preview after the selection settles ─────────────────── */
  useEffect(() => {
    if (view !== 'picker' || countdownValue !== null) return;

    stopPreview();
    const song = SONGS[selectedIndex]!;
    previewTimeout.current = window.setTimeout(() => {
      previewTimeout.current = null;
      const previewAudio = new Audio(song.src);
      previewAudioRef.current = previewAudio;
      previewAudio.volume = 0.35;
      previewAudio.currentTime = 0;
      previewAudio.play().catch(() => {
        if (previewAudioRef.current === previewAudio) previewAudioRef.current = null;
      });

      previewFadeTimeoutRef.current = window.setTimeout(() => {
        previewFadeTimeoutRef.current = null;
        previewFadeIntervalRef.current = window.setInterval(() => {
          previewAudio.volume = Math.max(0, previewAudio.volume - 0.035);
          if (previewAudio.volume > 0) return;

          previewAudio.pause();
          if (previewFadeIntervalRef.current != null) {
            window.clearInterval(previewFadeIntervalRef.current);
            previewFadeIntervalRef.current = null;
          }
          if (previewAudioRef.current === previewAudio) previewAudioRef.current = null;
        }, 80);
      }, 15000);
    }, 1500);

    return stopPreview;
  }, [countdownValue, selectedIndex, stopPreview, view]);

  /* ── Crossfade the ambient picker backdrop ────────────────────────────── */
  useEffect(() => {
    const nextBg = SONGS[selectedIndex]!.cover;
    const previousBg = currentBgRef.current;
    if (nextBg === previousBg) return;

    currentBgRef.current = nextBg;
    setPrevBg(previousBg);
    setCurrentBg(nextBg);
    setIsCurrentBgVisible(false);
    setIsPrevBgVisible(true);

    const frame = window.requestAnimationFrame(() => {
      setIsCurrentBgVisible(true);
      setIsPrevBgVisible(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedIndex]);

  /* ── Fade picker metadata between selections ───────────────────────────── */
  useEffect(() => {
    if (selectedIndex === displayedSongIndex) {
      setIsPickerSongInfoVisible(true);
      return;
    }

    setIsPickerSongInfoVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayedSongIndex(selectedIndex);
      setIsPickerSongInfoVisible(true);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [displayedSongIndex, selectedIndex]);

  useEffect(() => {
    if (view !== 'picker') return;
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    return () => carousel.removeEventListener('wheel', handleWheel);
  }, [handleWheel, view]);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current != null) {
        window.clearInterval(countdownIntervalRef.current);
      }
      stopPreview();
    };
  }, [stopPreview]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (view === 'picker') {
        if (countdownValue !== null) {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            cancelCountdown();
          }
          return;
        }

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          moveSelectedIndex(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          e.stopPropagation();
          moveSelectedIndex(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          startCountdown();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          stopPreview();
          onClose();
        }
        return;
      }

      if (view === 'player') {
        if (e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          togglePlay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          seek(5);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          e.stopPropagation();
          seek(-5);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
        return;
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [cancelCountdown, countdownValue, moveSelectedIndex, onClose, seek, startCountdown, stopPreview, togglePlay, view]);


  const progress = duration ? (currentTime / duration) * 100 : 0;

  /* ── Picker view ────────────────────────────────────────────────────────── */
  if (view === 'picker') {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col bg-[#0a0a0a] px-[6vw] py-6 md:py-10"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={prevBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
          style={{
            filter: 'blur(80px) brightness(0.2) saturate(1.8)',
            opacity: isPrevBgVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <img
          src={currentBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
          style={{
            filter: 'blur(80px) brightness(0.2) saturate(1.8)',
            opacity: isCurrentBgVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          ref={carouselRef}
          className="absolute left-[6vw] top-1/2 z-10 h-[700px] w-[360px] overflow-hidden"
          style={{
            overflow: 'hidden',
            perspective: '900px',
            perspectiveOrigin: 'center center',
            transform: 'translateY(-50%)',
          }}
        >
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {SONGS.map((song, index) => {
              const offset = index - selectedIndex;
              const selected = offset === 0;

              return (
                <div
                  key={song.title}
                  aria-hidden={Math.abs(offset) > 2}
                  className="absolute left-0 top-1/2 w-[360px]"
                  style={{
                    transformStyle: 'preserve-3d',
                    ...getItemStyle(offset),
                  }}
                >
                  <div
                    className="aspect-square w-full overflow-hidden rounded-xl"
                    style={{
                      border: selected ? '1px solid rgba(255,255,255,0.42)' : '1px solid transparent',
                      boxShadow: selected
                        ? '0 0 0 1px rgba(255,255,255,0.08), 0 22px 48px rgba(0,0,0,0.58)'
                        : 'none',
                    }}
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          aria-live="polite"
          className="absolute left-[45%] top-1/2 z-10 w-[min(43vw,680px)] text-left transition-opacity duration-200"
          style={{
            opacity: isPickerSongInfoVisible ? 1 : 0,
            transform: 'translateY(-50%)',
          }}
        >
          <p
            className="font-[family-name:var(--font-inter)] font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: 0 }}
          >
            {displayedPickerSong.title}
          </p>
          <p className="mt-2 text-base text-white/50 font-term">{displayedPickerSong.artist}</p>
          <div className="mt-8 border-l border-white/20 pl-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/35 font-term">
              Lyrics preview · {displayedPickerSong.lyrics.length} lines
            </p>
            <div className="space-y-1.5" aria-label={`Lyrics preview for ${displayedPickerSong.title}`}>
              {displayedPickerSong.lyrics.slice(0, PICKER_LYRIC_PREVIEW_LINES).map((line, index) => (
                <p
                  key={`${displayedPickerSong.title}-${index}`}
                  className="truncate font-[family-name:var(--font-inter)] text-[clamp(0.9rem,1.35vw,1.1rem)] leading-snug"
                  style={{ color: `rgba(255,255,255,${0.76 - index * 0.065})` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
        <p className="absolute bottom-6 left-0 right-0 z-10 text-center text-xs text-white/30 font-term md:bottom-10">
          ← → to navigate · ENTER to select · ESC to exit
        </p>
        {countdownValue !== null ? (
          <div
            aria-live="assertive"
            aria-atomic="true"
            className="z-[100] text-center"
            style={{
              position: 'fixed',
              inset: 0,
              display: 'grid',
              width: '100vw',
              height: '100dvh',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.92)',
            }}
          >
            <style>{`@keyframes karaoke-countdown-punch {
              from { transform: scale(1.22); opacity: 0.45; }
              to { transform: scale(1); opacity: 1; }
            }`}</style>
            <div style={{ gridArea: '1 / 1', justifySelf: 'center', alignSelf: 'center' }}>
              <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-white/45 font-term">
                Get ready
              </p>
              <p
                key={countdownValue}
                style={{
                  animation: 'karaoke-countdown-punch 200ms ease-out',
                  color: '#ffffff',
                  fontSize: 'clamp(8rem, 20vw, 14rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                }}
              >
                {countdownValue}
              </p>
              <p className="mt-4 text-[1.2rem] text-white/50 font-term">
                {SONGS[countdownSongIndexRef.current]!.title}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /* ── Player view ────────────────────────────────────────────────────────── */
  if (!currentSong) return null;

  // Prefer the time-matched transcript when it is available. The local
  // transcript remains a complete fallback, rather than a tiny lyric snippet.
  const lyricLines = synced?.length ? synced.map((line) => line.text) : currentSong.lyrics;
  const activeLyricIndex = activeIndex;
  const safeFocusIndex = Math.max(activeLyricIndex, 0);
  const lyricWindowStart = Math.max(
    0,
    Math.min(safeFocusIndex - 4, Math.max(0, lyricLines.length - PLAYER_LYRIC_WINDOW_LINES)),
  );
  const visible = lyricLines
    .slice(lyricWindowStart, lyricWindowStart + PLAYER_LYRIC_WINDOW_LINES)
    .map((text, index) => ({ text, index: lyricWindowStart + index }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0a0a0a] p-6 md:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ESC hint */}
      <div className="absolute right-6 top-6 z-10 text-xs text-white/30 font-term md:right-10 md:top-10">
        [ESC to exit]
      </div>

      {/* Top row: cover + metadata */}
      <div className="flex shrink-0 items-start gap-5">
        <div
          className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-xl md:h-[200px] md:w-[200px]"
          style={{
            boxShadow: dominantColor
              ? `0 0 80px 30px ${dominantColor}, 0 0 140px 60px ${dominantColor}`
              : `0 0 80px 30px rgba(228,242,34,0.15), 0 0 140px 60px rgba(228,242,34,0.08)`,
          }}
        >
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="relative z-10 h-full w-full object-cover"
          />
        </div>
        <div className="mt-2 flex flex-col">
          <p className="font-[family-name:var(--font-inter)] text-xl font-semibold text-white md:text-2xl">
            {currentSong.title}
          </p>
          <p className="mt-1 text-sm text-white/50 md:text-base" style={{ opacity: 0.5 }}>
            {currentSong.artist}
          </p>
          {!synced?.length && syncedLoaded ? (
            <p className="mt-2 text-xs text-white/30 font-term">(unsynced)</p>
          ) : null}
          {error ? (
            <p className="mt-2 text-xs text-red-400 font-term">{error}</p>
          ) : null}
        </div>
      </div>

      {/* Lyrics */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.18em] text-white/25 font-term md:left-3">
          {String(Math.max(safeFocusIndex + 1, 1)).padStart(2, '0')} / {String(lyricLines.length).padStart(2, '0')}
        </div>
        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-1.5 py-8 md:gap-2">
          {visible.map(({ text, index }) => {
            const distance = activeLyricIndex < 0 ? index + 1 : index - activeLyricIndex;
            const isActive = index === activeLyricIndex;
            const proximity = Math.abs(distance);
            const fontSize = isActive
              ? 'clamp(1.7rem, 3.1vw, 2.8rem)'
              : proximity <= 1
                ? 'clamp(1.05rem, 1.75vw, 1.45rem)'
                : 'clamp(0.88rem, 1.4vw, 1.12rem)';
            const opacity = isActive ? 1 : Math.max(0.22, 0.72 - proximity * 0.09);
            return (
              <p
                key={index}
                data-karaoke-active={isActive ? 'true' : undefined}
                className="w-full text-center leading-tight transition-all duration-200 ease-out"
                style={{
                  fontSize,
                  opacity,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.9)',
                  transform: `translateY(${Math.max(-6, Math.min(6, -distance * 2))}px)`,
                }}
              >
                {text}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bottom: time + progress bar + controls hint */}
      <div className="shrink-0">
        <div className="mb-2 flex justify-between text-xs text-white/30 font-term">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="h-[2px] w-full bg-white/10">
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: ACCENT }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-white/30 font-term">
          <span>SPACE to play/pause · ← −5s · → +5s</span>
          {isPlaying ? <span>playing</span> : <span>paused</span>}
        </div>
      </div>

      {/* Seek flash */}
      {seekFlash ? (
        <div className="pointer-events-none absolute bottom-24 right-6 rounded bg-[#e4f222] px-3 py-1 text-sm font-semibold text-black md:right-10">
          {seekFlash}
        </div>
      ) : null}

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
