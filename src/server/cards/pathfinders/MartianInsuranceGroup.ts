import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {played} from '../Options';

export class MartianInsuranceGroup extends CorporationCard {
  constructor() {
    super({
      name: CardName.MARTIAN_INSURANCE_GROUP,
      tags: [Tag.MARS],
      startingMegaCredits: 42,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'PfC12',
        description: 'You start with 42 M€ and 1 M€ production.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(42).production((pb) => pb.megacredits(1));
          b.corpBox('effect', (ce) => {
            ce.effect('Whenever you play an event card, raise your M€ production 1 step.', (eb) => {
              eb.event({played}).startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    if (player.isCorporation(this.name) && card.type === CardType.EVENT) {
      player.production.add(Resource.MEGACREDITS, 1, {log: true});
    }
  }
}
