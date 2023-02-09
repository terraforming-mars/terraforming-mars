import {Card} from '../Card';
import {ICorporationCard} from './ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';

export class InterplanetaryCinematics extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTERPLANETARY_CINEMATICS,
      tags: [Tag.BUILDING],
      startingMegaCredits: 30,

      behavior: {
        stock: {steel: 20},
      },

      metadata: {
        cardNumber: 'R19',
        description: 'You start with 20 steel and 30 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(30).nbsp.steel(20, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Each time you play an event, you gain 2 M€.', (eb) => {
              eb.event({played}).startEffect.megacredits(2);
            });
          });
        }),
      },
    });
  }
  public onCardPlayed(player: Player, card: IProjectCard) {
    if (player.isCorporation(this.name) && card.cardType === CardType.EVENT) {
      player.megaCredits += 2;
    }
  }
}
