import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { Game } from "../Game";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../constants";

export class RadChemFactory implements IProjectCard {
    public cost = 8;
    public tags = [Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.RAD_CHEM_FACTORY;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2, game, true) && hasEnergyProduction;
        }
  
        return hasEnergyProduction;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY,-1);
        player.increaseTerraformRatingSteps(2, game);
        return undefined;
    }
}
