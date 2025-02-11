import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PlayerInput} from '../../PlayerInput';
import {Player} from '../../Player';
import {CeoCard} from './CeoCard';
import {all, cancelled} from '../Options';

export class Huan extends CeoCard {
  constructor() {
    super({
      name: CardName.HUAN,
      metadata: {
        cardNumber: 'L29',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.trade({all, cancelled}).asterix().tradeFleet();
          b.br.br;
        }),
        description: 'ALL OPPONENTS CANNOT TRADE NEXT GENERATION. Gain 1 Trade Fleet.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    player.colonies.increaseFleetSize();
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} may not trade next generation.',
      (b) => b.player(player),
    );

    this.isDisabled = true;
    return undefined;
  }
}
