import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { Game } from '../Game';
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../constants";

export class RadChemFactory implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.RAD_CHEM_FACTORY;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * 2, game, true) && hasEnergyProduction;
        }
  
        return hasEnergyProduction;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-1);
        player.increaseTerraformRatingSteps(2, game);
        return undefined;
    }
}
