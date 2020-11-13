import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {Game} from '../Game';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../constants';

export class EquatorialMagnetizer implements IActionCard, IProjectCard {
    public cost = 11;
    public tags = [Tags.STEEL];
    public name = CardName.EQUATORIAL_MAGNETIZER;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;

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

