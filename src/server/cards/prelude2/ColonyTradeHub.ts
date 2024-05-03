import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class ColonyTradeHub extends PreludeCard {
  constructor() {
    super({
      name: CardName.COLONY_TRADE_HUB,
      tags: [Tag.SPACE],

      behavior: {
        production: {energy: 1},
        stock: {titanium: 3},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).titanium(3).br;
          b.effect('When a colony is placed, gain 2 M€', (eb) => eb.colonies(1, {all}).startEffect.megacredits(2));
        }),
        description: 'Increase your energy production 1 step. Gain 3 titanium',
      },
    });
  }

  onColonyAdded(_player: IPlayer, cardOwner: IPlayer) {
    cardOwner.stock.add(Resource.MEGACREDITS, 2, {log: true});
  }
}
