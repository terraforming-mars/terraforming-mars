import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {Tags} from '../Tags';

export class TerraformingControlStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TERRAFORMING_CONTROL_STATION,
      cost: 18,
      tags: [Tags.VENUS, Tags.MARS, Tags.SPACE],

      metadata: {
        cardNumber: 'Pf12',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Venus or Mars tag, pay 2MC less.', (eb) => {
            eb.venus(1).played.slash().mars(1).played.startEffect.megacredits(-2);
          });
          b.br.tr(2);
        }),
        description: 'Raise your TR 2 steps.',
      },
    });
  }

  public getCardDiscount(_player: Player, card: ICard) {
    if (card.tags.includes(Tags.VENUS) || card.tags.includes(Tags.MARS)) {
      return 2;
    }
    return 0;
  }

  public play(player: Player) {
    // TODO(kberg): Handle Turmoil efect.
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}

