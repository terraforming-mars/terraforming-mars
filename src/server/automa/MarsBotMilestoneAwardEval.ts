import {IMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';
import {Resource} from '@/common/Resource';
import {BoardName} from '@/common/boards/BoardName';
import {marsBotMapSet} from '@/common/automa/marsBotMapSet';
import {IMarsBot} from '@/server/automa/IMarsBot';

/**
 * Whether MarsBot follows `boardName`'s own milestone and award rules.
 *
 * That holds on `boardName` unless the game plays the Milestones & Awards expansion, whose rules
 * are written against the Tharsis board whatever map the game is played on. Random milestones
 * and awards keep the map's rules.
 */
export function marsBotUsesBoardGoals(marsBot: IMarsBot, boardName: BoardName): boolean {
  return marsBotMapSet(marsBot.game.gameOptions) === boardName;
}

/**
 * Whether MarsBot meets `milestone`.
 *
 * The milestone's own MarsBot rule decides when it has one (`marsBotCanClaim`). Otherwise the
 * milestone runs against MarsBot's player, whose tag counts and production come from its tracks.
 */
export function marsBotCanClaimMilestone(milestone: IMilestone, marsBot: IMarsBot): boolean {
  return milestone.marsBotCanClaim?.(marsBot) ?? milestone.canClaim(marsBot.player);
}

/**
 * How far `player` is from meeting a milestone, for MarsBot's "closest to meeting the criteria"
 * tiebreaker. A milestone that can't be counted is 0 away when the player qualifies and
 * infinitely far otherwise.
 */
export function milestoneRemaining(milestone: IMilestone, player: IPlayer): number {
  if (milestone.remaining !== undefined) {
    return milestone.remaining(player);
  }
  return milestone.canClaim(player) ? 0 : Infinity;
}

/**
 * The player's score in `award` as MarsBot compares it with its own.
 *
 * For Thermalist and Miner MarsBot considers the player's resources plus their production (rulebook A, p.8).
 */
export function humanAwardScore(award: IAward, player: IPlayer): number {
  switch (award.name) {
  case 'Thermalist':
    // Heat resources + energy resources (they become heat) + heat production. Energy
    // production doesn't count; designer ruling, BGG thread 3350125 (TDaver).
    return player.heat + player.energy + player.production.get(Resource.HEAT);
  case 'Miner':
    return player.steel + player.titanium + player.production.get(Resource.STEEL) + player.production.get(Resource.TITANIUM);
  default:
    return award.getScore(player);
  }
}

/** Claims the best milestone MarsBot meets. False when it meets none. */
export function maybeClaimMilestone(marsBot: IMarsBot): boolean {
  const best = selectMilestone(marsBot, getClaimableMilestones(marsBot));
  if (best === undefined) {
    return false;
  }

  marsBot.game.claimedMilestones.push({player: marsBot.player, milestone: best});
  marsBot.game.log('MarsBot claims milestone ${0}', (b) => b.rawString(best.name));

  // Briber milestone: lose 12 MC on claim
  if (best.name === 'Briber') {
    marsBot.loseMc(12);
    marsBot.game.log('MarsBot loses 12 MC (Briber)');
  }
  return true;
}

/**
 * Picks the milestone to claim from those MarsBot meets, by the tiebreakers on page 8:
 * 1) one the human also meets, 2) the one the human is closest to meeting, 3) leftmost
 * (Hoverlord last).
 */
export function selectMilestone(marsBot: IMarsBot, claimable: ReadonlyArray<IMilestone>): IMilestone | undefined {
  const sorted = claimable.toSorted((a, b) => {
    if (a.name === 'Hoverlord') {
      return 1;
    }
    if (b.name === 'Hoverlord') {
      return -1;
    }
    return 0;
  });

  const humanAlsoQualifies = sorted.filter((m) => m.canClaim(marsBot.humanPlayer));
  if (humanAlsoQualifies.length > 0) {
    return humanAlsoQualifies[0];
  }

  let best: IMilestone | undefined;
  let bestRemaining = Infinity;
  for (const m of sorted) {
    const remaining = milestoneRemaining(m, marsBot.humanPlayer);
    if (best === undefined || remaining < bestRemaining) {
      bestRemaining = remaining;
      best = m;
    }
  }
  return best;
}

/** The unclaimed milestones MarsBot meets. */
export function getClaimableMilestones(marsBot: IMarsBot): Array<IMilestone> {
  const game = marsBot.game;
  if (game.allMilestonesClaimed()) {
    return [];
  }
  return game.milestones.filter((m) => !game.milestoneClaimed(m) && marsBotCanClaimMilestone(m, marsBot));
}

/** Funds the unfunded award MarsBot leads the player by the most. False when it leads none. */
export function maybeFundAward(marsBot: IMarsBot): boolean {
  const game = marsBot.game;
  if (game.allAwardsFunded()) {
    return false;
  }

  const unfunded = game.awards.filter((a) => !game.hasBeenFunded(a));
  // Find the award where MarsBot is most ahead of the human
  let bestAward: IAward | undefined;
  let bestMargin = -Infinity;

  for (const award of unfunded) {
    // Per rules (page 8): "MarsBot considers your current number of resources plus your production"
    const margin = marsBot.awardValue(award) - humanAwardScore(award, marsBot.humanPlayer);
    if (margin > bestMargin || (margin === bestMargin && bestAward?.name === 'Venuphile')) {
      bestMargin = margin;
      bestAward = award;
    }
  }

  if (bestAward === undefined || bestMargin <= 0) {
    // MarsBot is not ahead on any award
    return false;
  }

  game.fundAward(marsBot.player, bestAward);
  game.log('MarsBot funds award ${0}', (b) => b.rawString(bestAward.name));
  return true;
}
