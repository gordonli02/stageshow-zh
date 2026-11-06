// 中文补丁：按词上屏的打字动画。
// Chinese is typed through an IME: letters go into a composition bar, then
// a whole word commits at once. `a.type` reveals one character at a time,
// which reads as pasting. `typeZh` commits the text word by word instead,
// with a pause before each commit (the moment of picking a candidate), so
// the rhythm is the one a viewer knows from their own keyboard.
//
//   import { typeZh } from '../../kit/zh'
//   await typeZh(a, 'draft', '帮我整理这周的发票')
//   await typeZh(a, 'draft', '帮我|整理|这周的|发票')        // your own cuts
//   await typeZh(a, 'draft', 'Figma 的 3 个新评论', { interval: 160 })
//
// Words come from `Intl.Segmenter` (Chrome, Safari, Node 16+) when the text
// has no `|` cuts; Latin runs and numbers inside the text commit as one
// word each, as an IME does when you switch to English.

import type { Act } from './act'

type TypeZhOptions = {
  /** Average ms between commits (150 by default); each varies ±30%, repeatable. */
  interval?: number
  /** Ms before the first word, the hands coming to the keys (0 by default). */
  lead?: number
}

const hash = (i: number) => ((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1

/** Split text into the words an IME would commit. `|` in the text sets the cuts by hand. */
export function segmentZh(text: string): string[] {
  if (text.includes('|')) return text.split('|').filter(Boolean)
  const Segmenter = (Intl as unknown as { Segmenter?: new (lang: string, o: { granularity: 'word' }) => { segment(s: string): Iterable<{ segment: string; isWordLike?: boolean }> } }).Segmenter
  if (!Segmenter) return Array.from(text).map((c) => c)
  const words: string[] = []
  for (const { segment, isWordLike } of new Segmenter('zh-CN', { granularity: 'word' }).segment(text)) {
    // Punctuation and spaces ride on the word before them: they come with the same keystroke
    if (!isWordLike && words.length) words[words.length - 1] += segment
    else words.push(segment)
  }
  return words
}

/** Type `text` into a string key of state, one IME word at a time. */
export async function typeZh<S>(a: Act<S>, key: keyof S, text: string, opts: TypeZhOptions = {}): Promise<void> {
  const interval = opts.interval ?? 150
  const words = segmentZh(text)
  let typed = ''
  await a.set({ [key]: typed } as Partial<S>)
  if (opts.lead) await a.wait(opts.lead)
  for (let i = 0; i < words.length; i++) {
    // Longer words take longer to spell before they commit
    const spell = 0.6 + 0.2 * Math.min(words[i]!.length, 4)
    await a.wait(interval * spell * (0.7 + 0.6 * hash(i)))
    typed += words[i]
    await a.set({ [key]: typed } as Partial<S>)
  }
}
