import {IProjectCard} from '../../cards/IProjectCard';
import {MarsBotDraftPriority} from '../MarsBotCorpTypes';
import {Tag} from '../../../common/cards/Tag';
import {MarsBotBoard} from '../MarsBotBoard';
import {hasIntersection} from '@/common/utils/utils';

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
   * in shuffled order, is the one discarded. At most one card leaves, and a draft where the
   * priority protects everything loses nothing.
   */
  public discardAfterDraft(
    drafted: Array<IProjectCard>,
    priority: MarsBotDraftPriority,
  ): {kept: Array<IProjectCard>, discarded: Array<IProjectCard>} {
    const cards = [...drafted];
    this.shuffler(cards);

    const saved = this.savedFromDiscard(cards, priority);
    const discardable = cards.findIndex((card) => !saved.has(card));
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

  private pickByLeastAdvancedTrack(hand: Array<IProjectCard>): IProjectCard {
    return this.pickByTags(hand, this.leastAdvancedTrackTags());
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
    return priorityTags.map((priorityTag) => card.tags.filter((tag) => tag === priorityTag).length);
  }

  private hasAnyTag(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): boolean {
    return hasIntersection(card.tags, priorityTags);
  }

  /** Wild tags count for nothing here: MarsBot reads the tags printed on the card. */
  private countTags(card: IProjectCard): number {
    return card.tags.filter((tag) => tag !== Tag.WILD).length;
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
