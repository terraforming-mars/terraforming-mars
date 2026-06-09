import {IProjectCard} from '../../cards/IProjectCard';
import {MarsBotDraftPriority} from '../MarsBotCorpTypes';
import {Tag} from '../../../common/cards/Tag';
import {Random} from '../../../common/utils/Random';
import {MarsBotBoard} from '../MarsBotBoard';
import {inplaceShuffle} from '../../utils/shuffle';

/**
 * Pick the item with the highest score, breaking ties randomly.
 * If all scores are 0, returns undefined (caller handles fallback).
 */
function pickBest<T>(items: T[], scorer: (t: T) => number, rng: Random): T | undefined {
  let bestScore = -1;
  const bestItems: T[] = [];
  for (const item of items) {
    const score = scorer(item);
    if (score > bestScore) {
      bestScore = score;
      bestItems.length = 0;
      bestItems.push(item);
    } else if (score === bestScore) {
      bestItems.push(item);
    }
  }
  if (bestScore <= 0) {
    return undefined;
  }
  return bestItems[rng.nextInt(bestItems.length)];
}

/**
 * Handles MarsBot draft card selection and post-draft discard based on corp draft priority.
 */
export class MarsBotDraftResolver {
  /**
   * Pick the best card for MarsBot from a hand based on the draft priority.
   */
  public static pickCardForMarsBot(
    hand: IProjectCard[],
    priority: MarsBotDraftPriority,
    rng: Random,
    board?: MarsBotBoard,
  ): IProjectCard {
    if (hand.length === 0) {
      throw new Error('Cannot pick from empty hand');
    }
    if (hand.length === 1) {
      return hand[0];
    }

    switch (priority.type) {
    case 'tags':
      return MarsBotDraftResolver.pickByTags(hand, priority.tags, rng);
    case 'mostExpensive':
      return pickBest(hand, (c) => c.cost, rng) ?? hand[rng.nextInt(hand.length)];
    case 'leastAdvancedTrack':
      return MarsBotDraftResolver.pickByLeastAdvancedTrack(hand, rng, board);
    case 'mostTags':
      return pickBest(hand, (c) => c.tags.filter((t) => t !== Tag.WILD).length, rng) ?? hand[rng.nextInt(hand.length)];
    }
  }

  /**
   * Post-draft discard: shuffle drafted cards, reveal from top.
   * If card has NO matching priority tag → discard. If it HAS a match → stop.
   * If all 4 checked → keep all.
   */
  public static postDraftDiscard(
    drafted: IProjectCard[],
    priority: MarsBotDraftPriority,
    rng: Random,
  ): {kept: IProjectCard[], discarded: IProjectCard[]} {
    if (priority.type !== 'tags') {
      return {kept: [...drafted], discarded: []};
    }

    const cards = [...drafted];
    inplaceShuffle(cards, rng);

    const discarded: IProjectCard[] = [];
    const kept: IProjectCard[] = [];

    let foundMatch = false;
    for (const card of cards) {
      if (foundMatch) {
        kept.push(card);
        continue;
      }
      if (MarsBotDraftResolver.cardMatchesTags(card, priority.tags)) {
        foundMatch = true;
        kept.push(card);
      } else {
        discarded.push(card);
      }
    }

    // If none matched, keep all (no discard)
    if (!foundMatch) {
      return {kept: cards, discarded: []};
    }

    return {kept, discarded};
  }

  private static pickByTags(hand: IProjectCard[], priorityTags: ReadonlyArray<Tag>, rng: Random): IProjectCard {
    return pickBest(hand, (c) => MarsBotDraftResolver.scoreCardByTags(c, priorityTags), rng) ??
      hand[rng.nextInt(hand.length)];
  }

  /**
   * Score a card by matching its tags against the priority list.
   * Higher-priority tags (earlier in the list) are weighted more.
   * Multiple matching tags score higher than a single match.
   */
  private static scoreCardByTags(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): number {
    let score = 0;
    for (const cardTag of card.tags) {
      if (cardTag === Tag.WILD) {
        continue;
      }
      const priorityIndex = priorityTags.indexOf(cardTag);
      if (priorityIndex >= 0) {
        score += (priorityTags.length - priorityIndex);
      }
    }
    return score;
  }

  private static cardMatchesTags(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): boolean {
    for (const cardTag of card.tags) {
      if (cardTag === Tag.WILD) {
        continue;
      }
      if (priorityTags.includes(cardTag)) {
        return true;
      }
    }
    return false;
  }

  private static pickByLeastAdvancedTrack(hand: IProjectCard[], rng: Random, board?: MarsBotBoard): IProjectCard {
    if (board === undefined) {
      return hand[rng.nextInt(hand.length)];
    }
    const leastIndex = board.getLeastAdvancedTrackIndex();
    const trackTags = board.data[leastIndex].tags;
    return MarsBotDraftResolver.pickByTags(hand, trackTags, rng);
  }
}
