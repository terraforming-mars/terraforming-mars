import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class VenusMagnetizer implements IActionCard, IProjectCard {
    public cost = 7;
    public tags = [Tags.VENUS];
    public name = CardName.VENUS_MAGNETIZER;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.VENUS, 10);
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
      const hasEnergyProduction = player.getProduction(Resources.ENERGY) > 0;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(REDS_RULING_POLICY_COST) && hasEnergyProduction && !venusMaxed;
      }

      return hasEnergyProduction && !venusMaxed;
    }
    public action(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -1);
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '256',
      requirements: CardRequirements.builder((b) => b.venus(10)),
      renderData: CardRenderer.builder((b) => {
        b.action('Decrease your Energy production 1 step to raise Venus 1 step.', (eb) => {
          eb.production((pb) => pb.energy(1)).startAction.venus(1);
        });
      }),
      description: 'Requires Venus 10%.',
    }
}
