'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { formatDate, isPastOrToday } from '../utils';

export function FlashcardsPage() {
  const { flashcards, topics, addFlashcard, updateFlashcard, deleteFlashcard, reviewFlashcard } =
    useWorkspaceStore();
  const dueCards = useMemo(
    () => flashcards.filter((card) => isPastOrToday(card.dueDate)),
    [flashcards],
  );
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [studyIndex, setStudyIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const studyCard = dueCards[studyIndex % Math.max(1, dueCards.length)];

  function submitCard() {
    if (!front.trim() || !back.trim()) return;
    addFlashcard({ front: front.trim(), back: back.trim(), topicId: topicId || undefined });
    setFront('');
    setBack('');
  }

  function gradeCard(quality: number) {
    if (!studyCard) return;
    reviewFlashcard(studyCard.id, quality);
    setRevealed(false);
    setStudyIndex((index) => index + 1);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Spaced repetition</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Flashcards</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Create cards, study due items, and update SM-2 scheduling.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard>
          <SectionHeader title="Study Mode" description={`${dueCards.length} cards due`} />
          {studyCard ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
              <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">Front</p>
              <p className="mt-4 text-xl font-semibold text-white">{studyCard.front}</p>
              {revealed && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">Back</p>
                  <p className="mt-3 text-zinc-300">{studyCard.back}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[1, 3, 4, 5].map((quality) => (
                      <Button
                        key={quality}
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => gradeCard(quality)}
                      >
                        Grade {quality}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {!revealed && (
                <Button type="button" className="mt-6" onClick={() => setRevealed(true)}>
                  Reveal answer
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No due flashcards. Nicely done.</p>
          )}
        </SurfaceCard>
        <SurfaceCard>
          <SectionHeader title="Create Flashcard" />
          <div className="grid gap-3">
            <Input
              value={front}
              onChange={(event) => setFront(event.target.value)}
              placeholder="Front"
            />
            <Input
              value={back}
              onChange={(event) => setBack(event.target.value)}
              placeholder="Back"
            />
            <select
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
              className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            <Button type="button" onClick={submitCard}>
              Add card
            </Button>
          </div>
        </SurfaceCard>
      </div>
      <SurfaceCard>
        <SectionHeader title="Card Library" />
        <div className="grid gap-3 md:grid-cols-2">
          {flashcards.map((card) => (
            <div key={card.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <Label>Front</Label>
              <Input
                value={card.front}
                onChange={(event) => updateFlashcard(card.id, { front: event.target.value })}
              />
              <Label className="mt-3 block">Back</Label>
              <Input
                value={card.back}
                onChange={(event) => updateFlashcard(card.id, { back: event.target.value })}
              />
              <p className="mt-3 text-xs text-zinc-500">
                Due {formatDate(card.dueDate)} • EF {card.easeFactor} • interval {card.interval}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => deleteFlashcard(card.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
