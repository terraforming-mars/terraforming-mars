import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class EcoLine extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ECOLINE,
      tags: [Tags.PLANT],
      startingMegaCredits: 36,

      metadata: {
        cardNumber: 'R17',
        description: 'You start with 2 plant production, 3 plants, and 36 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.plants(2)).nbsp.megacredits(36).plants(3).digit;
          b.corpBox('effect', (ce) => {
            ce.effect('You may always pay 7 plants, instead of 8, to place greenery.', (eb) => {
              eb.plants(7).digit.startAction.greenery();
            });
          });
        }),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    player.plants = 3;
    player.plantsNeededForGreenery = 7;
    return undefined;
  }
}
