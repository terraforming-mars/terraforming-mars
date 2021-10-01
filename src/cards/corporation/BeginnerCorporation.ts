import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class BeginnerCorporation extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BEGINNER_CORPORATION,

      metadata: {
        cardNumber: 'R00',
        description: 'You start with 42 M€. Instead of choosing from 10 cards during setup, you get 10 cards for free.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).nbsp.cards(10, {digit});
        }),
      },
      startingMegaCredits: 42,
    });
  }
  public play(player: Player) {
    player.drawCard(10);
    return undefined;
  }
}
