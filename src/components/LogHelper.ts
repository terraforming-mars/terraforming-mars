import {Game} from '../Game';
import {Player} from '../Player';
import {ICard} from '../cards/ICard';
import {Resources} from '../Resources';
import {ISpace} from '../ISpace';
import {TileType} from '../TileType';
import {Colony} from '../colonies/Colony';

export class LogHelper {
  static logAddResource(game: Game, player: Player, card: ICard, qty: number = 1): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    game.log('${0} added ${1} ${2} to ${3}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card));
  }

  static logRemoveResource(game: Game, player: Player, card: ICard, qty: number = 1, effect: string): void {
    let resourceType = 'resource(s)';

    if (card.resourceType) {
      resourceType = card.resourceType.toLowerCase() + '(s)';
    }

    game.log('${0} removed ${1} ${2} from ${3} to ${4}', (b) =>
      b.player(player).number(qty).string(resourceType).card(card).string(effect));
  }

  static logGainStandardResource(game: Game, player: Player, resource: Resources, qty: number = 1) {
    game.log('${0} gained ${1} ${2}', (b) => b.player(player).number(qty).string(resource));
  }

  static logGainProduction(game: Game, player: Player, resource: Resources, qty: number = 1) {
    game.log('${0}\'s ${1} production increased by ${2}', (b) => b.player(player).string(resource).number(qty));
  }

  static logCardChange(game: Game, player: Player, effect: string, qty: number = 1) {
    game.log('${0} ${1} ${2} card(s)', (b) => b.player(player).string(effect).number(qty));
  }

  static logTilePlacement(game: Game, player: Player, space: ISpace, tileType: TileType) {
    let type : string;

    switch (tileType) {
      case TileType.GREENERY:
        type = 'greenery tile';
        break;

      case TileType.CITY:
        type = 'city tile';
        break;

      case TileType.OCEAN:
        type = 'ocean tile';
        break;

      default:
        type = 'special tile';
        break;
    }

    this.logBoardTileAction(game, player, space, type);
  }

  static logBoardTileAction(game: Game, player: Player, space: ISpace, description: string, action: string = 'placed') {
    // Skip off-grid tiles
    if (space.x === -1 && space.y === -1) return;
    // Skip solo play random tiles
    if (player.name === 'neutral') return;

    const offset: number = Math.abs(space.y - 4);
    const row: number = space.y + 1;
    const position: number = space.x - offset + 1;

    game.log('${0} ${1} ${2} on row ${3} position ${4}', (b) =>
      b.player(player).string(action).string(description).number(row).number(position));
  }

  static logColonyTrackIncrease(game: Game, player: Player, colony: Colony, steps: number = 1) {
    game.log('${0} increased ${1} colony track ${2} step(s)', (b) =>
      b.player(player).colony(colony).number(steps));
  }

  static logTRIncrease(game: Game, player: Player, steps: number) {
    game.log('${0} gained ${1} TR', (b) => b.player(player).number(steps));
  }

  static logVenusIncrease(game: Game, player: Player, steps: number) {
    game.log('${0} increased Venus scale ${1} step(s)', (b) => b.player(player).number(steps));
  }

  static logDiscardedCards(game: Game, discardedCards: Array<ICard>) {
    game.log(discardedCards.length + ' card(s) were discarded', (b) => {
      discardedCards.forEach((card) => b.card(card));
    });
  }
}
