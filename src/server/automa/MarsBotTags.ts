import {ALL_TAGS, Tag} from '../../common/cards/Tag';
import {Tags} from '../player/Tags';
import {IPlayer} from '../IPlayer';
import {MarsBotBoard} from './MarsBotBoard';

/**
 * Override tag counting for MarsBot's player.
 *
 * Per the automa rules: "If an effect requires you to count the number of something
 * other or all players have, use the respective tracks on MarsBot's board instead
 * of its played cards."
 */
export class MarsBotTags extends Tags {
  constructor(player: IPlayer, private readonly board: MarsBotBoard) {
    super(player);
  }

  protected override rawCount(tag: Tag, _includeEventsTags: boolean): number {
    const trackIndex = this.board.getTrackIndexForTag(tag);
    if (trackIndex !== undefined) {
      return this.board.tracks[trackIndex].position;
    }
    return 0;
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
