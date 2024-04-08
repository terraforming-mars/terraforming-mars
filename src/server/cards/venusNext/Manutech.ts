import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Manutech extends CorporationCard {
  constructor() {
    super({
      name: CardName.MANUTECH,
      tags: [Tag.BUILDING],
      startingMegaCredits: 35,

      behavior: {
        production: {steel: 1},
      },

      metadata: {
        cardNumber: 'R23',
        description: 'You start with 1 steel production, and 35 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.steel(1)).nbsp.megacredits(35);
          b.corpBox('effect', (ce) => {
            ce.effect('For each step you increase the production of a resource, including this, you also gain that resource.', (eb) => {
              eb.production((pb) => pb.wild(1)).startEffect.wild(1);
            });
          });
        }),
      },
    });
  }

  public onProductionGain(player: IPlayer, resource: Resource, amount: number) {
    if (amount > 0) {
      player.stock.add(resource, amount);
    }
  }
}
