import {IProjectCard} from '../../cards/IProjectCard';
import {MarsBotDraftPriority} from '../MarsBotCorpTypes';
import {Tag} from '../../../common/cards/Tag';
import {MarsBotBoard} from '../MarsBotBoard';

/** Shuffles an array in place. The game passes a random shuffle; tests pass an order they control. */
export type Shuffler = <T>(items: Array<T>) => void;

/** Chooses MarsBot's draft card and its post-draft discard from the corp's draft priority. */
export class MarsBotDraftResolver {
  constructor(
    private readonly tracks: MarsBotBoard,
    private readonly shuffle: Shuffler,
  ) {}

  /** The card MarsBot takes from `hand`. */
  public pickCard(hand: Array<IProjectCard>, priority: MarsBotDraftPriority): IProjectCard {
    if (hand.length === 0) {
      throw new Error('Cannot pick from an empty hand');
    }

    switch (priority.type) {
    case 'tags':
      return this.pickByTags(hand, priority.tags);
    case 'mostExpensive':
      return this.pickBest(hand, (card) => card.cost);
    case 'leastAdvancedTrack':
      return this.pickByLeastAdvancedTrack(hand);
    case 'mostTags':
      return this.pickBest(hand, (card) => this.countTags(card));
    }
  }

  /**
   * Reveals the drafted cards one at a time, discarding those without a priority tag and
   * stopping at the first card that carries one. Corps drafting on anything other than tags
   * keep their whole draft.
   */
  public discardAfterDraft(
    drafted: Array<IProjectCard>,
    priority: MarsBotDraftPriority,
  ): {kept: Array<IProjectCard>, discarded: Array<IProjectCard>} {
    if (priority.type !== 'tags') {
      return {kept: [...drafted], discarded: []};
    }

    const cards = [...drafted];
    this.shuffle(cards);

    const firstMatch = cards.findIndex((card) => this.hasAnyTag(card, priority.tags));
    if (firstMatch === -1) {
      return {kept: cards, discarded: []};
    }
    return {kept: cards.slice(firstMatch), discarded: cards.slice(0, firstMatch)};
  }

  /**
   * The highest scoring item, breaking ties at random. A hand where nothing scores at all
   * is one big tie, which is how a card gets picked when none of them match.
   */
  private pickBest<T>(items: Array<T>, score: (item: T) => number): T {
    let best = -1;
    let tied: Array<T> = [];
    for (const item of items) {
      const value = score(item);
      if (value > best) {
        best = value;
        tied = [item];
      } else if (value === best) {
        tied.push(item);
      }
    }
    this.shuffle(tied);
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
   * Tags earlier in the priority list are worth more, so a card matching the first priority
   * beats one matching the second, and a card matching several beats one matching a single tag.
   * Priorities only ever list printed tags, so a wild tag matches nothing and scores zero.
   */
  private scoreByTags(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): number {
    let score = 0;
    for (const tag of card.tags) {
      const priority = priorityTags.indexOf(tag);
      if (priority >= 0) {
        score += priorityTags.length - priority;
      }
    }
    return score;
  }

  private hasAnyTag(card: IProjectCard, priorityTags: ReadonlyArray<Tag>): boolean {
    return card.tags.some((tag) => priorityTags.includes(tag));
  }

  /** Wild tags count for nothing here: MarsBot reads the tags printed on the card. */
  private countTags(card: IProjectCard): number {
    return card.tags.filter((tag) => tag !== Tag.WILD).length;
  }
}
