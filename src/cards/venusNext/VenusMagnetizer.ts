import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class VenusMagnetizer extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUS_MAGNETIZER,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '256',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to raise Venus 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 10%.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 10);
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) > 0;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnergyProduction && !venusMaxed;
    }

    return hasEnergyProduction && !venusMaxed;
  }
  public action(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
