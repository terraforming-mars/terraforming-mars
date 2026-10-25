import {Tag} from '@/common/cards/Tag';
import {IAward} from '@/server/awards/IAward';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {IMilestone} from '@/server/milestones/IMilestone';

/**
 * Returns whether MarsBot meets the criteria of `milestone`.
 *
 * Uses the milestone's `marsBotCanClaim` when it has one, and its ordinary `canClaim` for the
 * bot's player otherwise.
 */
export function marsBotCanClaimMilestone(milestone: IMilestone, bot: IMarsBot): boolean {
  return milestone.marsBotCanClaim?.(bot) ?? milestone.canClaim(bot.player);
}

/**
 * Returns MarsBot's standing in `award`.
 *
 * Uses the award's `marsBotScore` when it has one, and its ordinary `getScore` for the bot's
 * player otherwise.
 */
export function marsBotAwardScore(award: IAward, bot: IMarsBot): number {
  return award.marsBotScore?.(bot) ?? award.getScore(bot.player);
}

/**
 * Returns the space MarsBot has reached on the track that carries `tag`, or 0 when no track
 * carries it.
 */
export function marsBotTrackPosition(bot: IMarsBot, tag: Tag): number {
  const index = bot.marsBotBoard.tagToTrack[tag];
  return index === undefined ? 0 : bot.marsBotBoard.tracks[index].position;
}

/** Returns the space MarsBot has reached on every track except the Venus track. */
export function marsBotTrackPositionsWithoutVenus(bot: IMarsBot): Array<number> {
  return bot.marsBotBoard.tracks
    .filter((track) => !track.definition.tags.includes(Tag.VENUS))
    .map((track) => track.position);
}
