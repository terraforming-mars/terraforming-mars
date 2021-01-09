import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class OreProcessor extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ORE_PROCESSOR,
      tags: [Tags.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '104',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 titanium and increase oxygen 1 step.', (eb) => {
            eb.energy(4).digit.startAction.titanium(1).oxygen(1);
          });
        }),
      },
    });
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
  public canAct(player: Player, game: Game): boolean {
    const hasEnoughEnergy = player.energy >= 4;
    const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
    }

    return hasEnoughEnergy;
  }
  public action(player: Player, game: Game) {
    player.energy -= 4;
    player.titanium++;
    return game.increaseOxygenLevel(player, 1);
  }
}
