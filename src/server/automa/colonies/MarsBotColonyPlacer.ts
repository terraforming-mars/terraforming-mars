import {IGame} from '../../IGame';
import {IColony} from '../../colonies/IColony';
import {comparing} from '../../../common/utils/Ordering';
import {inplaceRemove, toName} from '../../../common/utils/utils';
import {pickByFlippedCard} from '../MarsBotCardFlip';

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
