import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {DeltaProjectData, DeltaPlayerProgress} from './DeltaProjectData';
import {Color} from '../../common/Color';
import {Tag} from '../../common/cards/Tag';
import {Resource} from '../../common/Resource';
import {SelectOption} from '../inputs/SelectOption';
import {SelectCard} from '../inputs/SelectCard';
import {OrOptions} from '../inputs/OrOptions';
import {VictoryPointsBreakdownBuilder} from '../game/VictoryPointsBreakdownBuilder';
import {DrawCards} from '../deferredActions/DrawCards';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardResource} from '../../common/CardResource';
import {IActionCard, ICard, isIActionCard, isIHasCheckLoops} from '../cards/ICard';

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
    const players = new Map<Color, DeltaPlayerProgress>();
    for (const player of game.playersInGenerationOrder) {
      players.set(player.color, {position: 0, claimed2VP: false, claimed5VP: false, jovianBonus: false});
    }
    return {players};
  }

  public static getData(game: IGame): DeltaProjectData {
    if (game.deltaProjectData === undefined) {
      throw new Error('Delta Project data not initialized');
    }
    return game.deltaProjectData;
  }

  private static getProgress(data: DeltaProjectData, color: Color): DeltaPlayerProgress {
    const progress = data.players.get(color);
    if (progress === undefined) {
      throw new Error('No Delta Project progress for player ' + color);
    }
    return progress;
  }

  private static isSpotClaimed(data: DeltaProjectData, spot: 'claimed2VP' | 'claimed5VP'): boolean {
    for (const progress of data.players.values()) {
      if (progress[spot]) return true;
    }
    return false;
  }

  public static getPosition(game: IGame, player: IPlayer): number {
    return DeltaProjectExpansion.getProgress(DeltaProjectExpansion.getData(game), player.color).position;
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

  // Whether the player has enough tags (using wilds to fill gaps) to reach targetPos.
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
    const progress = DeltaProjectExpansion.getProgress(data, player.color);
    const currentPos = progress.position;

    if (currentPos >= TRACK_LENGTH) return 0;

    let maxPos = currentPos;

    for (let pos = currentPos + 1; pos <= TRACK_LENGTH; pos++) {
      const energyCost = pos - currentPos;
      if (energyCost > player.energy) break;

      if (!DeltaProjectExpansion.canReachPosition(player, pos)) break;

      if (pos === 10) {
        if (DeltaProjectExpansion.isSpotClaimed(data, 'claimed2VP')) continue;
      }
      if (pos === 11) {
        if (DeltaProjectExpansion.isSpotClaimed(data, 'claimed5VP')) break;
      }

      maxPos = pos;
    }

    return maxPos - currentPos;
  }

  public static advance(player: IPlayer, steps: number): void {
    const game = player.game;
    const data = DeltaProjectExpansion.getData(game);
    const progress = DeltaProjectExpansion.getProgress(data, player.color);
    const currentPos = progress.position;
    const newPos = currentPos + steps;

    player.stock.deduct(Resource.ENERGY, steps);
    progress.position = newPos;

    if (newPos === 10 && !DeltaProjectExpansion.isSpotClaimed(data, 'claimed2VP')) {
      progress.claimed2VP = true;
    }
    if (newPos === 11 && !DeltaProjectExpansion.isSpotClaimed(data, 'claimed5VP')) {
      progress.claimed5VP = true;
      progress.claimed2VP = false;
    }

    DeltaProjectExpansion.resolveReward(player, newPos);

    game.log('${0} advanced ${1} step(s) on the Delta Project track', (b) => b.player(player).number(steps));
  }

  private static resolveReward(player: IPlayer, position: number): void {
    const game = player.game;
    const data = DeltaProjectExpansion.getData(game);

    switch (position) {
    case 1: // Building: Choose 2 steel or 2 plants
      player.defer(() => new OrOptions(
        new SelectOption('Gain 2 steel', 'Gain steel').andThen(() => {
          player.stock.add(Resource.STEEL, 2, {log: true});
          return undefined;
        }),
        new SelectOption('Gain 2 plants', 'Gain plants').andThen(() => {
          player.stock.add(Resource.PLANTS, 2, {log: true});
          return undefined;
        }),
      ));
      break;

    case 2: // Power: Choose +1 energy production or +1 heat production
      player.defer(() => new OrOptions(
        new SelectOption('Increase energy production 1 step', 'Increase').andThen(() => {
          player.production.add(Resource.ENERGY, 1, {log: true});
          return undefined;
        }),
        new SelectOption('Increase heat production 1 step', 'Increase').andThen(() => {
          player.production.add(Resource.HEAT, 1, {log: true});
          return undefined;
        }),
      ));
      break;

    case 3: // Earth: +2 MC production
      player.production.add(Resource.MEGACREDITS, 2, {log: true});
      break;

    case 4: // Space: +1 titanium production
      player.production.add(Resource.TITANIUM, 1, {log: true});
      break;

    case 5: // Science: Look at top 4 cards, take 2, discard rest
      game.defer(DrawCards.keepSome(player, 4, {keepMax: 2}));
      break;

    case 6: { // Plant: Gain 1 plant per plant tag
      const plantCount = player.tags.count(Tag.PLANT);
      if (plantCount > 0) {
        player.stock.add(Resource.PLANTS, plantCount, {log: true});
      }
      break;
    }

    case 7: { // Microbe: Reuse a used blue card action
      const actionCards = DeltaProjectExpansion.getUsedActionCards(player);
      if (actionCards.length > 0) {
        player.defer(() => new SelectCard<IActionCard & ICard>(
          'Use a blue card action that has already been used this generation',
          'Take action',
          actionCards,
        ).andThen(([card]) => {
          game.log('${0} reused ${1} action via Delta Project', (b) => b.player(player).card(card));
          return card.action(player);
        }));
      }
      break;
    }

    case 8: { // Jovian: Gain one Jovian tag
      const progress = DeltaProjectExpansion.getProgress(data, player.color);
      if (!progress.jovianBonus) {
        progress.jovianBonus = true;
        player.tags.extraJovianTags++;
        for (const card of player.tableau) {
          card.onNonCardTagAdded?.(player, Tag.JOVIAN);
        }
        for (const p of game.playersInGenerationOrder) {
          for (const card of p.tableau) {
            card.onNonCardTagAddedByAnyPlayer?.(p, Tag.JOVIAN);
          }
        }
        game.log('${0} gained a Jovian tag from the Delta Project', (b) => b.player(player));
      }
      break;
    }

    case 9: // Animal: Add 2 animals to any card
      game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {count: 2}));
      break;

      // Positions 10/11 (VP spots) have no additional reward beyond VP claiming
    }
  }

  private static getUsedActionCards(player: IPlayer): Array<IActionCard & ICard> {
    const result: Array<IActionCard & ICard> = [];
    for (const playedCard of player.tableau) {
      if (!isIActionCard(playedCard)) continue;
      if (isIHasCheckLoops(playedCard) && playedCard.getCheckLoops() >= 2) continue;
      if (player.actionsThisGeneration.has(playedCard.name) && playedCard.canAct(player)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public static calculateVictoryPoints(player: IPlayer, builder: VictoryPointsBreakdownBuilder): void {
    const data = player.game.deltaProjectData;
    if (data === undefined) return;

    const progress = data.players.get(player.color);
    if (progress === undefined) return;

    if (progress.claimed5VP) {
      builder.setVictoryPoints('victoryPoints', 5, 'Delta Project (5VP)');
    } else if (progress.claimed2VP) {
      builder.setVictoryPoints('victoryPoints', 2, 'Delta Project (2VP)');
    }
  }
}
