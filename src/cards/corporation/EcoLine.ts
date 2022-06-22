import {Card} from '../Card';
import {ICorporationCard} from './ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class EcoLine extends Card implements ICorporationCard {
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
          b.production((pb) => pb.plants(2)).nbsp.megacredits(36).plants(3, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('You may always pay 7 plants, instead of 8, to place greenery.', (eb) => {
              eb.plants(7, {digit}).startAction.greenery();
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
