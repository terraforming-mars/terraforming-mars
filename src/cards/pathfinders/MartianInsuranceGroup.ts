import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {played} from '../Options';

export class MartianInsuranceGroup extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MARTIAN_INSURANCE_GROUP,
      tags: [Tags.MARS],
      startingMegaCredits: 42,

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

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.isCorporation(this.name) && card.cardType === CardType.EVENT) {
      player.addProduction(Resources.MEGACREDITS, 1, {log: true});
    }
  }
}
