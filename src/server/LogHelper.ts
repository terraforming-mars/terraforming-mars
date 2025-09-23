import {CardName} from '../common/cards/CardName';
import {Resource} from '../common/Resource';
import {IPlayer} from './IPlayer';
import {ICard} from './cards/ICard';
import {Space} from './boards/Space';
import {TileType, tileTypeToString} from '../common/TileType';
import {IColony} from './colonies/IColony';
import {Logger} from './logs/Logger';
import {CardResource} from '../common/CardResource';

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

    player.game.log('${0} ${1} ${2} at ${3}', (b) =>
      b.player(player).string(action).string(description).space(space));
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

  static logStealFromNeutralPlayer(player: IPlayer, resource: Resource, amount: number) {
    player.game.log('${0} stole ${1} ${2} from the neutral player', (b) => b.player(player).number(amount).string(resource));
  }

  public static logMoveResource(player: IPlayer, resource: CardResource, from: ICard, to: ICard) {
    player.game.log('${0} moved 1 ${1} from ${2} to ${3}.', (b) => b.player(player).string(resource).card(from).card(to));
  }
}
