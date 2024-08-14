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
        stock: {titanium: 2},
      },

      metadata: {
        cardNumber: 'P46',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).titanium(2).br;
          b.effect('When any colony is placed, gain 2 M€.', (eb) => eb.colonies(1, {all}).startEffect.megacredits(2));
        }),
        description: 'Increase your energy production 1 step. Gain 2 titanium',
      },
    });
  }

  onColonyAdded(_player: IPlayer, cardOwner: IPlayer) {
    cardOwner.stock.add(Resource.MEGACREDITS, 2, {log: true});
  }
}
