import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Polyphemos extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.POLYPHEMOS,
      startingMegaCredits: 50,
      cardType: CardType.CORPORATION,
      cardCost: 5,

      metadata: {
        cardNumber: 'R11',
        description: 'You start with 50 M€. Increase your M€ production 5 steps. Gain 5 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(50).nbsp.production((pb) => pb.megacredits(5)).nbsp.titanium(5, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('When you buy a card to hand, pay 5M€ instead of 3, including the starting hand.', (eb) => {
              eb.cards(1).asterix().startEffect.megacredits(5);
            });
          });
        }),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 5);
    player.titanium = 5;
    return undefined;
  }
}
