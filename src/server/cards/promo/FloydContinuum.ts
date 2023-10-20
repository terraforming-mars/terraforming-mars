import * as constants from '../../../common/constants';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {IActionCard} from '../ICard';

// Note: Floyd Continuum comes from the Dutch international open.
// https://boardgamegeek.com/thread/3120204/dutch-open-terraformingmars-international-4th-tour

export class FloydContinuum extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cost: 4,
      name: CardName.FLOYD_CONTINUUM,
      tags: [Tag.SCIENCE],
      type: CardType.ACTIVE,

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 3 M€ per completed terraforming parameter.', (eb) => {
            eb.empty().startAction.megacredits(3).slash().oceans(1).oxygen(1).temperature(1).asterix();
          });
          b.br;
          b.plainText('(FAN NOTE: This will apply to Venus but not The Moon.)');
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: IPlayer) {
    let count = 0;
    const game = player.game;
    if (game.getTemperature() === constants.MAX_TEMPERATURE) {
      count++;
    }
    if (game.getOxygenLevel() === constants.MAX_OXYGEN_LEVEL) {
      count++;
    }
    if (!game.canAddOcean()) {
      count++;
    }
    if (game.getVenusScaleLevel() === constants.MAX_VENUS_SCALE) {
      count++;
    }
    player.stock.add(Resource.MEGACREDITS, 3 * count, {log: true});
    return undefined;
  }
}
