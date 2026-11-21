import {IGame} from '../../IGame';
import {IColony} from '../../colonies/IColony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {IMarsBot} from '../IMarsBot';
import {comparing} from '../../../common/utils/Ordering';
import {inplaceRemove, toName} from '../../../common/utils/utils';
import {pickByFlippedCard} from '../MarsBotCardFlip';

/** The colony tiles MarsBot can build on: active, not full, and without a colony of its own. */
export function eligibleColonies(marsBot: IMarsBot): Array<IColony> {
  return marsBot.game.colonies.filter((colony) => {
    if (!colony.isActive) {
      return false;
    }
    if (colony.isFull()) {
      return false;
    }
    if (colony.colonies.includes(marsBot.player.id)) {
      return false;
    }
    return true;
  });
}

/**
 * Picks a colony tile for MarsBot to build on by revealing a project card (C-15b, C-16a).
 *
 * Returns undefined when no tile is eligible.
 */
export function selectRandomColony(marsBot: IMarsBot): IColony | undefined {
  return pickByFlippedCard(marsBot.game, eligibleColonies(marsBot));
}

/**
 * Adds one of the colony tiles left out of the game to it, picked the C-15b way (Aridor's setup).
 *
 * Returns the added tile, or undefined when every tile is already in play.
 */
export function addRandomColonyTile(game: IGame): IColony | undefined {
  const colony = pickByFlippedCard(game, game.discardedColonies);
  if (colony === undefined) {
    return undefined;
  }
  game.colonies.push(colony);
  game.colonies.sort(comparing(toName));
  inplaceRemove(game.discardedColonies, colony);
  // C-1: every colony tile in a MarsBot game starts active, Titan, Enceladus and Miranda included
  colony.isActive = true;
  game.log('MarsBot added a new Colony tile: ${0}', (b) => b.colony(colony));
  return colony;
}

/**
 * Builds a colony for MarsBot on `colony`.
 *
 * MarsBot ignores the tile's printed reward and stores 2 resources in the tile's storage area instead
 * (C-19). Europa places an ocean, or takes a Failed Action when none fits (C-24a). Titan gives 2
 * floaters (C-23).
 */
export function placeColony(colony: IColony, marsBot: IMarsBot): void {
  const game = marsBot.game;
  const colonyName = colony.name;

  // C-24a: Europa — place an ocean tile instead of 2 resources
  if (colonyName === ColonyName.EUROPA) {
    // The colony is placed either way (no build bonus, the ocean is the reward). Only the ocean
    // gives way to a Failed Action when none fits (rulebook C, p.5).
    addColony(colony, marsBot);
    marsBot.placeOcean();
    return;
  }

  // All other tiles: add colony and give 2 resources to shipping board (C-19)
  addColony(colony, marsBot);

  if (colonyName === ColonyName.TITAN) {
    if (game.gameOptions.expansions.venus) {
      game.log('MarsBot gains 2 floaters for its colony on ${0}', (b) => b.colony(colony));
    } else {
      game.log('MarsBot gains 2 floaters in Titan storage for its colony on ${0}', (b) => b.colony(colony));
    }
    marsBot.addFloaters(2);
    return;
  }

  // Standard colony placement: 2 resources to shipping board (C-19)
  game.log('MarsBot gains 2 resources in storage for its colony on ${0}', (b) => b.colony(colony));
  marsBot.shippingBoard.add(colonyName, 2);
}

/** Adds MarsBot's colony to `colony` without the printed build bonus, and tells MarsBot's corp. */
function addColony(colony: IColony, marsBot: IMarsBot): void {
  colony.addColony(marsBot.player, {skipBonus: true});
  marsBot.notifyColonyPlaced();
}
