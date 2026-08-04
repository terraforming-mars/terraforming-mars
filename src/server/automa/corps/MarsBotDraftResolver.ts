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
    private readonly tracks: MarsBotBoard,
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
   * Taking the cards in shuffled order, the first one without a priority tag is discarded and
   * everything else is kept, so at most one card leaves. A draft where every card carries a
   * priority tag loses nothing. Corps drafting on anything other than tags keep their whole draft.
   */
  public discardAfterDraft(
    drafted: Array<IProjectCard>,
    priority: MarsBotDraftPriority,
  ): {kept: Array<IProjectCard>, discarded: Array<IProjectCard>} {
    if (priority.type !== 'tags') {
      return {kept: [...drafted], discarded: []};
    }

    const cards = [...drafted];
    this.shuffler(cards);

    const firstMiss = cards.findIndex((card) => !this.hasAnyTag(card, priority.tags));
    if (firstMiss === -1) {
      return {kept: cards, discarded: []};
    }
    return {
      kept: cards.filter((_, index) => index !== firstMiss),
      discarded: [cards[firstMiss]],
    };
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
    const leastAdvanced = this.tracks.getLeastAdvancedTrackIndex();
    return this.pickByTags(hand, this.tracks.data[leastAdvanced].tags);
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

/** Compares two scores entry by entry. Positive when `a` outranks `b`, negative when it loses. */
function compareScores(a: ReadonlyArray<number>, b: ReadonlyArray<number>): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}
