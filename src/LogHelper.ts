import {CardName} from './CardName';
import {Game} from './Game';
import {Player} from './Player';
import {ICard} from './cards/ICard';
import {Resources} from './Resources';
import {ISpace} from './boards/ISpace';
import {TileType} from './TileType';
import {Colony} from './colonies/Colony';

export class LogHelper {
  static logAddResource(player: Player, card: ICard, qty: number = 1): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    player.game.log('${0} added ${1} ${2} to ${3}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card));
  }

  static logRemoveResource(player: Player, card: ICard, qty: number = 1, effect: string): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    player.game.log('${0} removed ${1} ${2} from ${3} to ${4}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card).string(effect));
  }

  static logGainStandardResource(player: Player, resource: Resources, qty: number = 1) {
    player.game.log('${0} gained ${1} ${2}', (b) => b.player(player).number(qty).string(resource));
  }

  static logGainProduction(player: Player, resource: Resources, qty: number = 1) {
    player.game.log('${0}\'s ${1} production increased by ${2}', (b) => b.player(player).string(resource).number(qty));
  }

  static logCardChange(player: Player, effect: string, qty: number = 1) {
    player.game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(effect).number(qty));
  }

  static logTilePlacement(player: Player, space: ISpace, tileType: TileType) {
    this.logBoardTileAction(player, space, TileType.toString(tileType) + ' tile');
  }

  static logBoardTileAction(player: Player, space: ISpace, description: string, action: string = 'placed') {
    // Skip off-grid tiles
    if (space.x === -1 && space.y === -1) return;
    // Skip solo play random tiles
    if (player.name === 'neutral') return;

    const offset: number = Math.abs(space.y - 4);
    const row: number = space.y + 1;
    const position: number = space.x - offset + 1;

    player.game.log('${0} ${1} ${2} on row ${3} position ${4}', (b) =>
      b.player(player).string(action).string(description).number(row).number(position));
  }

  static logColonyTrackIncrease(player: Player, colony: Colony, steps: number = 1) {
    player.game.log('${0} increased ${1} colony track ${2} step(s)', (b) =>
      b.player(player).colony(colony).number(steps));
  }

  static logTRIncrease(player: Player, steps: number) {
    player.game.log('${0} gained ${1} TR', (b) => b.player(player).number(steps));
  }

  static logVenusIncrease(player: Player, steps: number) {
    player.game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(steps));
  }

  static logDiscardedCards(game: Game, cards: Array<ICard> | Array<CardName>) {
    game.log(cards.length + ' card(s) were discarded', (b) => {
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    });
  }

  static logDrawnCards(player: Player, cards: Array<ICard> | Array<CardName>) {
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
    player.game.log(message, (b) => {
      b.player(player);
      for (const card of cards) {
        if (typeof card === 'string') {
          b.cardName(card);
        } else {
          b.card(card);
        }
      }
    });
  }
}
