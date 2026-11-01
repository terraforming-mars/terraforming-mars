// Shared helpers for tools that draw milestones and awards outside a real game.

import {chooseMilestonesAndAwards} from '../ma/MilestoneAwardSelector';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../game/GameOptions';
import {BoardName} from '../../common/boards/BoardName';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';

/** The expansions that change which milestones and awards can be drawn. */
export const MA_EXPANSIONS = ['venus', 'colonies', 'turmoil', 'ares', 'moon', 'pathfinders', 'underworld'] as const;
export type MAExpansion = typeof MA_EXPANSIONS[number];

/** Everything about a game that affects how its milestones and awards are drawn. */
export type MAScenario = {
  board: BoardName;
  randomMA: RandomMAOptionType;
  modularMA: boolean;
  includeFanMA: boolean;
  expansions: Record<MAExpansion, boolean>;
};

export type DrawResult =
  | {ok: true, milestones: ReadonlyArray<MilestoneName>, awards: ReadonlyArray<AwardName>}
  | {ok: false, error: string};

/**
 * Game options for a scenario. Sets both the expansions record and the older per-expansion flags,
 * as game creation does: the selector reads the record for compatibility and venusNextExtension
 * for how many to draw.
 */
export function gameOptionsFor(scenario: MAScenario): GameOptions {
  const {expansions} = scenario;
  return {
    ...DEFAULT_GAME_OPTIONS,
    boardName: scenario.board,
    randomMA: scenario.randomMA,
    modularMA: scenario.modularMA,
    includeFanMA: scenario.includeFanMA,
    expansions: {...DEFAULT_GAME_OPTIONS.expansions, ...expansions},
    venusNextExtension: expansions.venus,
    coloniesExtension: expansions.colonies,
    turmoilExtension: expansions.turmoil,
    aresExtension: expansions.ares,
    moonExpansion: expansions.moon,
    pathfindersExpansion: expansions.pathfinders,
    underworldExpansion: expansions.underworld,
  };
}

/** Draws milestones and awards once. A failure to find a valid set comes back as ok: false. */
export function drawMAs(scenario: MAScenario): DrawResult {
  try {
    const drawn = chooseMilestonesAndAwards(gameOptionsFor(scenario));
    return {ok: true, milestones: drawn.milestones, awards: drawn.awards};
  } catch (e) {
    return {ok: false, error: e instanceof Error ? e.message : String(e)};
  }
}

export function noExpansions(): Record<MAExpansion, boolean> {
  return Object.fromEntries(MA_EXPANSIONS.map((e) => [e, false])) as Record<MAExpansion, boolean>;
}

/** A short description of a scenario, such as "hellas, modular, fan MAs, +venus +ares". */
export function describeScenario(scenario: MAScenario): string {
  const parts: Array<string> = [scenario.board];
  if (scenario.randomMA !== RandomMAOptionType.LIMITED) {
    parts.push(scenario.randomMA);
  }
  if (scenario.modularMA) {
    parts.push('modular');
  }
  if (scenario.includeFanMA) {
    parts.push('fan MAs');
  }
  const expansions = MA_EXPANSIONS.filter((e) => scenario.expansions[e]);
  if (expansions.length > 0) {
    parts.push(expansions.map((e) => `+${e}`).join(' '));
  }
  return parts.join(', ');
}
