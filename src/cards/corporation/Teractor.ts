import {Card} from '../Card';
import {Tags} from '../Tags';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Teractor extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TERACTOR,
      tags: [Tags.EARTH],
      startingMegaCredits: 60,

      cardDiscount: {tag: Tags.EARTH, amount: 3},
      metadata: {
        cardNumber: 'R30',
        description: 'You start with 60 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(60);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, you pay 3 M€ less for it.', (eb) => {
              eb.earth(1, {played}).startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.EARTH).length * 3;
  }
  public play() {
    return undefined;
  }
}
