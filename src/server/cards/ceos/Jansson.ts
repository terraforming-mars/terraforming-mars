import {MarsBoard} from '@/server/boards/MarsBoard';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

export class Jansson extends CeoCard {
  constructor() {
    super({
      name: CardName.JANSSON,
      metadata: {
        cardNumber: 'L10',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().emptyTile().wild(1).asterix();
        }),
        description: 'Once per game, gain all placement bonuses under your tiles on Mars.',
      },
    });
  }

  private spaces(player: IPlayer) {
    return player.game.board.spaces.filter((space) => space.tile !== undefined && space.player === player);
  }

  public override canAct(player: IPlayer): boolean {
    if (this.isDisabled) {
      return false;
    }
    for (const space of this.spaces(player)) {
      if (!MarsBoard.canAffordPlacementBonuses(player, space)) {
        return false;
      }
    }
    return true;
  }

  public action(player: IPlayer): undefined {
    this.isDisabled = true;
    for (const space of this.spaces(player)) {
      player.game.grantSpaceBonuses(player, space);
    }
    return undefined;
  }
}

