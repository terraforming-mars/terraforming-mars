import {IProjectCard} from '../../cards/IProjectCard';
import {MarsBotDraftPriority} from '../MarsBotCorpTypes';
import {Tag} from '../../../common/cards/Tag';
import {MarsBotBoard} from '../MarsBotBoard';
import {hasIntersection} from '@/common/utils/utils';
import {marsBotCardTags} from '../MarsBotTags';

/** Shuffles an array in place. The game passes a random shuffle; tests pass an order they control. */
export type Shuffler = <T>(items: Array<T>) => void;

/** Chooses MarsBot's draft card and its post-draft discard from the corp's draft priority. */
export class MarsBotDraftResolver {
  constructor(
    private readonly marsBotBoard: MarsBotBoard,
    private readonly shuffler: Shuffler,
  ) {}

  /** Returns the card MarsBot takes from `hand`. */
  public pickCard(hand: Array<IProjectCard>, priority: MarsBotDraftPriority): IProjectCard {
    if (hand.length === 0) {
      throw new Error('Cannot pick from an empty hand');
    }

    switch (priority.type) {
    case 'tags':
      return this.pickByTags(hand, priority.tags);
    case 'mostExpensive':
      return this.pickBest(hand, (card) => [card.cost]);
    case 'leastAdvancedTrack':
      return this.pickByLeastAdvancedTrack(hand);
    case 'mostTags':
      return this.pickBest(hand, (card) => [this.countTags(card)]);
    }
  }

  /**
   * Splits the drafted cards into the ones MarsBot keeps and the one it discards.
   *
   * The corp's draft priority protects its best cards, and the first card it does not protect,
   * in shuffled order, is the one discarded. At most one card leaves. When a tag priority
   * protects every card, the one with the fewest matches goes anyway (Nick, BGG 3398289, over
   * rulebook B p.2); Credicor and Spire then discard nothing, as their cards print.
   */
  public discardAfterDraft(
    drafted: Array<IProjectCard>,
    priority: MarsBotDraftPriority,
  ): {kept: Array<IProjectCard>, discarded: Array<IProjectCard>} {
    const cards = [...drafted];
    this.shuffler(cards);

    const saved = this.savedFromDiscard(cards, priority);
    let discardable = cards.findIndex((card) => !saved.has(card));
    if (discardable === -1 && (priority.type === 'tags' || priority.type === 'leastAdvancedTrack')) {
      discardable = this.fewestMatches(cards, priority);
    }
    if (discardable === -1) {
      return {kept: cards, discarded: []};
    }
    return {
      kept: cards.filter((_, index) => index !== discardable),
      discarded: [cards[discardable]],
    };
  }

  /**
   * Returns the drafted cards the corp's draft priority keeps out of the discard.
   *
   * Corps drafting on tags save every card carrying one, and the others save the cards that
   * won the draft on their own terms: the most expensive, or the most tags. Aridor reads the
   * same track it drafted on, which cannot have moved since, as tracks only advance once
   * MarsBot starts resolving cards.
   */
  private savedFromDiscard(
    cards: ReadonlyArray<IProjectCard>,
    priority: MarsBotDraftPriority,
  ): ReadonlySet<IProjectCard> {
    switch (priority.type) {
    case 'tags':
      return new Set(cards.filter((card) => this.hasAnyTag(card, priority.tags)));
    case 'leastAdvancedTrack':
      return new Set(cards.filter((card) => this.hasAnyTag(card, this.leastAdvancedTrackTags())));
    case 'mostExpensive':
      return topScoring(cards, (card) => card.cost);
    case 'mostTags':
      return topScoring(cards, (card) => this.countTags(card));
    }
  }

  /**
   * Returns the highest scoring item, breaking ties at random.
   *
   * Scores are compared entry by entry, so the first entry decides unless it ties, and only
   * then does the second. Items that all score alike are one big tie, which is how a card gets
   * picked when none of them match.
   */
  private pickBest<T>(items: Array<T>, scorer: (item: T) => ReadonlyArray<number>): T {
    let best: ReadonlyArray<number> = [];
    let tied: Array<T> = [];
    for (const item of items) {
      const score = scorer(item);
      const ranking = tied.length === 0 ? 1 : compareScores(score, best);
      if (ranking > 0) {
        best = score;
        tied = [item];
      } else if (ranking === 0) {
        tied.push(item);
      }
    }
    this.shuffler(tied);
    return tied[0];
  }

  private pickByTags(hand: Array<IProjectCard>, priorityTags: ReadonlyArray<Tag>): IProjectCard {
    return this.pickBest(hand, (card) => this.scoreByTags(card, priorityTags));
  }

  /**
   * Aridor drafts for a track, not a tag list: every tag on that track counts alike, the card with
   * the most of them wins and ties go at random.
   */
  private pickByLeastAdvancedTrack(hand: Array<IProjectCard>): IProjectCard {
    return this.pickBest(hand, (card) => this.scoreByTrack(card));
  }

  private scoreByTrack(card: IProjectCard): ReadonlyArray<number> {
    const trackTags = this.leastAdvancedTrackTags();
    return [marsBotCardTags(card).filter((tag) => trackTags.includes(tag)).length];
  }

  /** Returns the index of the first card, in `cards`' order, that scores lowest on a tag priority, or -1 with no cards. */
  private fewestMatches(
    cards: ReadonlyArray<IProjectCard>,
    priority: Extract<MarsBotDraftPriority, {type: 'tags' | 'leastAdvancedTrack'}>,
  ): number {
    const score = (card: IProjectCard) =>
      priority.type === 'tags' ? this.scoreByTags(card, priority.tags) : this.scoreByTrack(card);
    let worst = cards.length === 0 ? -1 : 0;
    for (let i = 1; i < cards.length; i++) {
      if (compareScores(score(cards[i]), score(cards[worst])) < 0) {
        worst = i;
      }
    }
    return worst;
  }

  private leastAdvancedTrackTags(): ReadonlyArray<Tag> {
    return this.marsBotBoard.definitions[this.marsBotBoard.getLeastAdvancedTrackIndex()].tags;
  }

  /**
   * Returns the score for `card` based on the priority tags: how many of each it carries, in
   * priority order.
   *
   * Comparing those counts in order is what the rules ask for. A card carrying the first
   * priority tag beats one that does not, however many lower priority tags that card has, and
   * among cards that tie on the first tag the second tag decides. Priorities only ever list
   * printed tags, so a wild tag matches nothing.
   */
  private scoreByTags(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): ReadonlyArray<number> {
    const tags = marsBotCardTags(card);
    return priorityTags.map((priorityTag) => tags.filter((tag) => tag === priorityTag).length);
  }

  private hasAnyTag(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): boolean {
    return hasIntersection(marsBotCardTags(card), priorityTags);
  }

  /** Counts every tag on the card, wild tags included. */
  private countTags(card: IProjectCard): number {
    return marsBotCardTags(card).length;
  }
}

/** Returns the items tied for the highest score, which is every item when they all score alike. */
function topScoring<T>(items: ReadonlyArray<T>, scorer: (item: T) => number): ReadonlySet<T> {
  const best = Math.max(...items.map(scorer));
  return new Set(items.filter((item) => scorer(item) === best));
}

/** Compares two scores entry by entry. Positive when `a` outranks `b`, negative when it loses. */
function compareScores(a: ReadonlyArray<number>, b: ReadonlyArray<number>): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}
