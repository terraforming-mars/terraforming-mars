import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class Steelworks extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.STEELWORKS,
      tags: [Tags.BUILDING],
      cost: 15,

      metadata: {
        cardNumber: '103',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 2 steel and increase oxygen 1 step.', (eb) => {
            eb.energy(4).digit.startAction.steel(2).oxygen(1);
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    const hasEnoughEnergy = player.energy >= 4;
    const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
    }

    return hasEnoughEnergy;
  }
  public action(player: Player) {
    player.energy -= 4;
    player.steel += 2;
    return player.game.increaseOxygenLevel(player, 1);
  }
  public play() {
    return undefined;
  }
}
