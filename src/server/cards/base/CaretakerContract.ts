import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class CaretakerContract extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CARETAKER_CONTRACT,
      cost: 3,
      requirements: CardRequirements.builder((b) => b.temperature(0)),
      metadata: {
        cardNumber: '154',
        description: 'Requires 0° C or warmer.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 heat to increase your terraform rating 1 step.', (eb) => {
            eb.heat(8).startAction.tr(1);
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.availableHeat() >= 8 && player.canAfford(0, {
      reserveUnits: Units.of({heat: 8}),
      tr: {tr: 1},
    });
  }
  public action(player: Player) {
    return player.spendHeat(8, () => {
      player.increaseTerraformRating();
      return undefined;
    });
  }
}
