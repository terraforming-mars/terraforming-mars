import {Tag} from '../../common/cards/Tag';
import {IMilestone} from '../milestones/IMilestone';
import {IAward} from '../awards/IAward';
import {IMarsBot} from './MarsBotCorpTypes';

/**
 * MarsBot claims milestones and scores awards through the ordinary IMilestone and IAward
 * code, called with its player. That works because the bot's player answers tag counts and
 * production from its board tracks. The few milestones and awards where the automa rules
 * say something else override marsBotCanClaim or marsBotScore on their own class.
 */
export function marsBotCanClaimMilestone(milestone: IMilestone, bot: IMarsBot): boolean {
  return milestone.marsBotCanClaim?.(bot) ?? milestone.canClaim(bot.player);
}

export function marsBotAwardScore(award: IAward, bot: IMarsBot): number {
  return award.marsBotScore?.(bot) ?? award.getScore(bot.player);
}

/** The position of the track `tag` advances, or 0 when no track carries the tag. */
export function marsBotTrackPosition(bot: IMarsBot, tag: Tag): number {
  const index = bot.board.getTrackIndexForTag(tag);
  return index === undefined ? 0 : bot.board.tracks[index].position;
}

/** Every track position, the Venus track included when in play. */
export function marsBotAllTrackPositions(bot: IMarsBot): Array<number> {
  return bot.board.tracks.map((track) => track.position);
}

/** The Mars track positions, leaving a Venus track out. */
export function marsBotMarsTrackPositions(bot: IMarsBot): Array<number> {
  return bot.board.tracks
    .filter((track) => !track.definition.tags.includes(Tag.VENUS))
    .map((track) => track.position);
}
