import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {played} from '../Options';

export class TerraformingControlStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TERRAFORMING_CONTROL_STATION,
      cost: 18,
      tags: [Tags.VENUS, Tags.MARS, Tags.SPACE],
      tr: {tr: 2},

      cardDiscount: [{tag: Tags.VENUS, amount: 2}, {tag: Tags.MARS, amount: 2}],
      metadata: {
        cardNumber: 'Pf12',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Venus or Mars tag, pay 2 M€ less.', (eb) => {
            eb.venus(1, {played}).slash().mars(1, {played}).startEffect.megacredits(-2);
          });
          b.br.tr(2);
        }),
        description: 'Raise your TR 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}

