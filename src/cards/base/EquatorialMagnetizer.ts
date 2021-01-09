import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class EquatorialMagnetizer extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EQUATORIAL_MAGNETIZER,
      tags: [Tags.BUILDING],
      cost: 11,
      hasRequirements: false,

      metadata: {
        cardNumber: '015',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to increase your terraform rating 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.tr(1);
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player, game: Game): boolean {
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(REDS_RULING_POLICY_COST) && hasEnergyProduction;
    }

    return hasEnergyProduction;
  }
  public action(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, -1);
    player.increaseTerraformRating(game);
    return undefined;
  }
}

