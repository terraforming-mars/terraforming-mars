import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

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
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const hasEnoughHeat = player.availableHeat >= 8;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughHeat;
    }

    return hasEnoughHeat;
  }
  public action(player: Player) {
    return player.spendHeat(8, () => {
      player.increaseTerraformRating();
      return undefined;
    });
  }
}
