import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
// import {PlayerInput} from '../../PlayerInput';
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

  public action(player: Player): undefined {
    const spaces = player.game.board.spaces.filter((space) => space.tile !== undefined && space.player === player);
    spaces.forEach((space) => {
      player.game.grantSpaceBonuses(player, space);
    });

    this.isDisabled = true;

    return undefined;
  }
}

