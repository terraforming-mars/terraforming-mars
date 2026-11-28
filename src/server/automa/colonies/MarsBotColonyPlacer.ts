import {IGame} from '../../IGame';
import {IColony} from '../../colonies/IColony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {IMarsBot} from '../IMarsBot';
import {comparing} from '../../../common/utils/Ordering';
import {inplaceRemove, toName} from '../../../common/utils/utils';
import {pickByFlippedCard} from '../MarsBotCardFlip';

/**
 * Picks a colony tile for MarsBot to build on by revealing a project card (rulebook C, p.4-5).
 *
 * Returns undefined when no tile is eligible.
 */
export function selectRandomColony(marsBot: IMarsBot): IColony | undefined {
  return pickByFlippedCard(marsBot.game, marsBot.player.colonies.getPlayableColonies());
}

/**
 * Adds one of the colony tiles left out of the game to it, picked the way Expedited Construction picks one
 * (rulebook C, p.4; Aridor's setup).
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
  // Every colony tile in a MarsBot game starts active, Titan, Enceladus and Miranda included (rulebook C, p.4)
  colony.isActive = true;
  game.log('MarsBot added a new Colony tile: ${0}', (b) => b.colony(colony));
  return colony;
}

/**
 * Builds a colony for MarsBot on `colony`.
 *
 * MarsBot ignores the tile's printed reward and stores 2 resources in the tile's storage area instead.
 * Europa places an ocean, or takes a Failed Action when none fits. Titan gives 2
 * floaters (rulebook C, p.5).
 */
export function placeColony(colony: IColony, marsBot: IMarsBot): void {
  const game = marsBot.game;
  const colonyName = colony.name;

  // Europa places an ocean instead of storing 2 resources
  if (colonyName === ColonyName.EUROPA) {
    // The colony is placed either way (no build bonus, the ocean is the reward). Only the ocean
    // gives way to a Failed Action when none fits (rulebook C, p.5).
    addColony(colony, marsBot);
    marsBot.placeOcean();
    return;
  }

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

  game.log('MarsBot gains 2 resources in storage for its colony on ${0}', (b) => b.colony(colony));
  marsBot.shippingBoard.add(colonyName, 2);
}

/** Adds MarsBot's colony to `colony` without the printed build bonus, and tells MarsBot's corp. */
function addColony(colony: IColony, marsBot: IMarsBot): void {
  colony.addColony(marsBot.player, {skipBonus: true});
  marsBot.notifyColonyPlaced();
}
