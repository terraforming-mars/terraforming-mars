import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Manutech extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.MANUTECH,
      tags: [Tags.BUILDING],
      startingMegaCredits: 35,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R23',
        description: 'You start with 1 steel production, and 35 MC.',
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

  public play(player: Player) {
    player.addProduction(Resources.STEEL);
    return undefined;
  }

  public static onProductionGain(player: Player, resource: Resources, amount: number) {
    if (amount > 0) {
      player.setResource(resource, amount);
    }
  }
}
