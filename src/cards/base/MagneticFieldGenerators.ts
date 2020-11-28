import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';

export class MagneticFieldGenerators implements IProjectCard {
    public cost = 20;
    public tags = [Tags.STEEL];
    public name = CardName.MAGNETIC_FIELD_GENERATORS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const meetsEnergyRequirements = player.getProduction(Resources.ENERGY) >= 4;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 3, game, true) && meetsEnergyRequirements;
      }

      return meetsEnergyRequirements;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -4);
      player.addProduction(Resources.PLANTS, 2);
      player.increaseTerraformRatingSteps(3, game);
      return undefined;
    }
}
