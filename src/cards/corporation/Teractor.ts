import {Card} from '../Card';
import {Tags} from '../Tags';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Teractor extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.TERACTOR,
      tags: [Tags.EARTH],
      startingMegaCredits: 60,

      metadata: {
        cardNumber: 'R30',
        description: 'You start with 60 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(60);
          b.corpBox('effect', (ce) => {
            ce.effectBox((eb) => {
              eb.earth(1).played.startEffect.megacredits(-3);
              eb.description('Effect: When you play an Earth tag, you pay 3 MC less for it.');
            });
          });
        }),
      },
    });
  }
  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.EARTH).length * 3;
  }
  public play() {
    return undefined;
  }
}
