import {CardName} from '../common/cards/CardName';
import {IPlayer} from './IPlayer';
import {ICard} from './cards/ICard';
import {Space} from './boards/Space';
import {TileType, tileTypeToString} from '../common/TileType';
import {IColony} from './colonies/IColony';
import {Logger} from './logs/Logger';

export class LogHelper {
  static logAddResource(player: IPlayer, card: ICard, qty: number = 1): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    player.game.log('${0} added ${1} ${2} to ${3}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card));
  }

  static logRemoveResource(player: IPlayer, card: ICard, qty: number = 1, effect: string): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    player.game.log('${0} removed ${1} ${2} from ${3} to ${4}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card).string(effect));
  }

  static logTilePlacement(player: IPlayer, space: Space, tileType: TileType) {
    this.logBoardTileAction(player, space, tileTypeToString[tileType] + ' tile');
  }

  static logBoardTileAction(player: IPlayer, space: Space, description: string, action: string = 'placed') {
    // Skip off-grid tiles
    if (space.x === -1 && space.y === -1) return;
    // Skip solo play random tiles
    if (player.name === 'neutral') return;

    const offset = Math.abs(space.y - 4);
    const row = space.y + 1;
    const position = space.x - offset + 1;

    player.game.log('${0} ${1} ${2} on row ${3} position ${4}', (b) =>
      b.player(player).string(action).string(description).number(row).number(position));
  }

  static logColonyTrackIncrease(player: IPlayer, colony: IColony, steps: number = 1) {
    player.game.log('${0} increased ${1} colony track ${2} step(s)', (b) =>
      b.player(player).colony(colony).number(steps));
  }

  static logColonyTrackDecrease(player: IPlayer, colony: IColony) {
    player.game.log('${0} decreased ${1} colony track 1 step', (b) =>
      b.player(player).colony(colony));
  }

  static logVenusIncrease(player: IPlayer, steps: number) {
    player.game.log('${0} raised the Venus scale ${1} step(s)', (b) => b.player(player).number(steps));
  }

  static logDiscardedCards(logger: Logger, cards: ReadonlyArray<ICard> | ReadonlyArray<CardName>) {
    logger.log('${0} card(s) were discarded', (b) => {
      b.rawString(cards.length.toString());
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    });
  }

  static logDrawnCards(player: IPlayer, cards: ReadonlyArray<ICard> | ReadonlyArray<CardName>, privateMessage: boolean = false) {
    // If |this.count| equals 3, for instance, this generates "${0} drew ${1}, ${2} and ${3}"
    let message = '${0} drew ';
    if (cards.length === 0) {
      message += 'no cards';
    } else {
      for (let i = 0, length = cards.length; i < length; i++) {
        if (i > 0) {
          if (i < length - 1) {
            message += ', ';
          } else {
            message += ' and ';
          }
        }
        message += '${' + (i + 1) + '}';
      }
    }
    const options = privateMessage ? {reservedFor: player} : {};

    player.game.log(message, (b) => {
      if (privateMessage === false) {
        b.player(player);
      } else {
        b.string('You');
      }
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    }, options);
  }
}
