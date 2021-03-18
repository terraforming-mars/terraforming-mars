import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Aphrodite extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.APHRODITE,
      tags: [Tags.PLANT, Tags.VENUS],
      startingMegaCredits: 47,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R01',
        description: 'You start with 1 plant production and 47 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.plants(1)).nbsp.megacredits(47);
          b.corpBox('effect', (ce) => {
            ce.effect('Whenever Venus is terraformed 1 step, you gain 2MC.', (eb) => {
              eb.venus(1).any.startEffect.megacredits(2);
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    return undefined;
  }
}
