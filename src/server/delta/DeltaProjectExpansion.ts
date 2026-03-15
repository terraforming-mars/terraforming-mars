import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {DeltaProjectData} from './DeltaProjectData';
import {Color} from '../../common/Color';
import {Tag} from '../../common/cards/Tag';
import {Resource} from '../../common/Resource';
import {SelectAmount} from '../inputs/SelectAmount';
import {PlayerInput} from '../PlayerInput';
import {VictoryPointsBreakdownBuilder} from '../game/VictoryPointsBreakdownBuilder';

/**
 * The ordered tags for each track position (1-indexed).
 * Position 0 is the starting position (no tag).
 * Positions 10 and 11 are the 2VP and 5VP spots (no tag requirement).
 */
export const DELTA_TRACK_TAGS: ReadonlyArray<Tag | undefined> = [
  undefined,     // 0: start
  Tag.BUILDING,  // 1
  Tag.POWER,     // 2
  Tag.EARTH,     // 3
  Tag.SPACE,     // 4
  Tag.SCIENCE,   // 5
  Tag.PLANT,     // 6
  Tag.MICROBE,   // 7
  Tag.JOVIAN,    // 8
  Tag.ANIMAL,    // 9
  undefined,     // 10: 2VP
  undefined,     // 11: 5VP
];

export const TRACK_LENGTH = DELTA_TRACK_TAGS.length - 1; // 11

export class DeltaProjectExpansion {
  private constructor() {}

  public static initialize(game: IGame): DeltaProjectData {
    const playerPositions = new Map<Color, number>();
    for (const player of game.playersInGenerationOrder) {
      playerPositions.set(player.color, 0);
    }
    return {
      playerPositions,
      claimed2VP: [],
      claimed5VP: [],
      jovianBonus: [],
    };
  }

  public static getData(game: IGame): DeltaProjectData {
    if (game.deltaProjectData === undefined) {
      throw new Error('Delta Project data not initialized');
    }
    return game.deltaProjectData;
  }

  public static getPosition(game: IGame, player: IPlayer): number {
    return DeltaProjectExpansion.getData(game).playerPositions.get(player.color) ?? 0;
  }

  /**
   * Compute the maximum number of steps a player can advance from their current position.
   *
   * Constraints:
   * - Must have the required tag (raw, without wilds) for each step, OR use a wild tag.
   * - Each wild tag covers exactly one missing tag.
   * - Must have enough energy (1 per step).
   * - Cannot land on a VP spot that already has a claimant.
   * - Cannot move beyond position 11 (5VP).
   */

  //Whether the player has enough tags (using wilds to fill gaps) to reach targetPos.
  private static canReachPosition(player: IPlayer, targetPos: number): boolean {
    let missing = 0;
    for (let pos = 1; pos <= Math.min(targetPos, 9); pos++) {
      const tag = DELTA_TRACK_TAGS[pos];
      if (tag !== undefined && player.tags.count(tag, 'raw') === 0) {
        missing++;
      }
    }
    return missing <= player.tags.count(Tag.WILD, 'raw');
  }

  public static maxSteps(player: IPlayer): number {
    const game = player.game;
    const data = DeltaProjectExpansion.getData(game);
    const currentPos = data.playerPositions.get(player.color) ?? 0;

    if (currentPos >= TRACK_LENGTH) return 0;

    let maxPos = currentPos;

    for (let pos = currentPos + 1; pos <= TRACK_LENGTH; pos++) {
      const energyCost = pos - currentPos;
      if (energyCost > player.energy) break;

      if (!DeltaProjectExpansion.canReachPosition(player, pos)) break;

      if (pos === 10) {
        if (data.claimed2VP.length >= 1) continue; // claimed, skip past
      }
      if (pos === 11) {
        if (data.claimed5VP.length >= 1) break; // claimed, can't go further
      }

      maxPos = pos;
    }

    return maxPos - currentPos;
  }

  public static canAct(player: IPlayer): boolean {
    if (player.game.deltaProjectData === undefined) return false;
    if (player.deltaProjectActionUsedThisGeneration) return false;
    if (player.energy < 1) return false;
    return DeltaProjectExpansion.maxSteps(player) > 0;
  }

  public static action(player: IPlayer): PlayerInput {
    const max = DeltaProjectExpansion.maxSteps(player);

    return new SelectAmount(
      'Delta Project: Pay energy to advance on the track',
      'Advance',
      1,
      max,
    ).andThen((amount) => {
      DeltaProjectExpansion.advance(player, amount);
      return undefined;
    });
  }

  public static advance(player: IPlayer, steps: number): void {
    const game = player.game;
    const data = DeltaProjectExpansion.getData(game);
    const currentPos = data.playerPositions.get(player.color) ?? 0;
    const newPos = currentPos + steps;

    player.stock.deduct(Resource.ENERGY, steps);
    data.playerPositions.set(player.color, newPos);
    player.deltaProjectActionUsedThisGeneration = true;

    // Claim VP spot if landing on one (moving to 5VP replaces 2VP)
    if (newPos === 10 && !data.claimed2VP.includes(player.color)) {
      data.claimed2VP.push(player.color);
    }
    if (newPos === 11 && !data.claimed5VP.includes(player.color)) {
      data.claimed5VP.push(player.color);
      const idx = data.claimed2VP.indexOf(player.color);
      if (idx !== -1) {
        data.claimed2VP.splice(idx, 1);
      }
    }

    // Jovian bonus
    if (newPos === 8 && !data.jovianBonus.includes(player.color)) {
      data.jovianBonus.push(player.color);
    }

    game.log('${0} advanced ${1} step(s) on the Delta Project track', (b) => b.player(player).number(steps));
  }

  public static calculateVictoryPoints(player: IPlayer, builder: VictoryPointsBreakdownBuilder): void {
    const data = player.game.deltaProjectData;
    if (data === undefined) return;

    if (data.claimed5VP.includes(player.color)) {
      builder.setVictoryPoints('victoryPoints', 5, 'Delta Project (5VP)');
    } else if (data.claimed2VP.includes(player.color)) {
      builder.setVictoryPoints('victoryPoints', 2, 'Delta Project (2VP)');
    }
  }
}
