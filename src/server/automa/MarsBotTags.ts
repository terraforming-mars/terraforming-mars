import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {Tags} from '../player/Tags';
import {IPlayer} from '../IPlayer';
import {MarsBotBoard} from './MarsBotBoard';
import {IProjectCard} from '../cards/IProjectCard';
import {CardType} from '../../common/cards/CardType';

/**
 * The tags MarsBot reads on a card. An event shows the Event tag in its corner, but the
 * codebase leaves it out of card.tags, so it is added here.
 */
export function cardTagsIncludingEvent(card: IProjectCard): Array<Tag> {
  const tags: Array<Tag> = [...card.tags];
  if (card.type === CardType.EVENT && !tags.includes(Tag.EVENT)) {
    tags.push(Tag.EVENT);
  }
  return tags;
}

/**
 * The VP printed on a card's icon, or undefined when the card shows none.
 *
 * A conditional or per-resource icon gives the points it shows per step, not what it scores now.
 */
export function printedVictoryPoints(card: IProjectCard): number | undefined {
  const vp = card.metadata.victoryPoints;
  return typeof vp === 'object' ? vp.points : vp;
}

/**
 * Override tag counting for MarsBot's player.
 *
 * Per the automa rules: "If an effect requires you to count the number of something
 * other or all players have, use the respective tracks on MarsBot's board instead
 * of its played cards."
 */
export class MarsBotTags extends Tags {
  constructor(player: IPlayer, private readonly marsBotBoard: MarsBotBoard) {
    super(player);
  }

  protected override rawCount(tag: Tag, _includeEventsTags: boolean): number {
    return this.marsBotBoard.trackPosition(tag);
  }

  // countAllTags skips Event and calls getPlayedEventsCount separately,
  // so we override to route Event through the track as well.
  public override countAllTags(): Record<Tag, number> {
    const counts: Record<Tag, number> = {} as Record<Tag, number>;
    for (const tag of ALL_TAGS) {
      counts[tag] = this.count(tag, 'raw');
    }
    return counts;
  }
}
