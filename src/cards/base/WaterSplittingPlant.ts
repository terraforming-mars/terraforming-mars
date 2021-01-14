import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WaterSplittingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_SPLITTING_PLANT,
      tags: [Tags.BUILDING],
      cost: 12,

      metadata: {
        cardNumber: '177',
        requirements: CardRequirements.builder((b) => b.oceans(2)),
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 Energy to raise oxygen 1 step.', (eb) => {
            eb.energy(3).startAction.oxygen(1);
          });
        }),
        description: 'Requires 2 ocean tiles.',
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player, game: Game): boolean {
    const hasEnoughEnergy = player.energy >= 3;
    const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
    }

    return hasEnoughEnergy;
  }
  public action(player: Player, game: Game) {
    player.energy -= 3;
    return game.increaseOxygenLevel(player, 1);
  }
}
