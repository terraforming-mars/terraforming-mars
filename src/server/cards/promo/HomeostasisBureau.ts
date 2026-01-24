import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {GlobalParameter} from '../../../common/GlobalParameter';

export class HomeostasisBureau extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HOMEOSTASIS_BUREAU,
      cost: 16,
      tags: [Tag.BUILDING],

      behavior: {
        production: {heat: 2},
      },

      metadata: {
        cardNumber: 'X57',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you raise the temperature, gain 3 M€.', (eb) => eb.temperature(1).startEffect.megacredits(3));
          b.br;
          b.production((b) => b.heat(2));
        }),
        description: 'Increase your heat production 2 steps.',
      },
    });
  }

  onGlobalParameterIncrease?(player: IPlayer, parameter: GlobalParameter, steps: number) {
    if (parameter === GlobalParameter.TEMPERATURE) {
      player.stock.add(Resource.MEGACREDITS, 3 * steps, {log: true});
    }
  }
}
