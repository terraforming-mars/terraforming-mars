import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardType } from "./CardType";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../constants";

export class MagneticFieldDome implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.MAGNETIC_FIELD_DOME;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 2;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, true) && hasEnergyProduction;
        }
  
        return hasEnergyProduction;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.PLANTS);
        player.increaseTerraformRating(game);
        return undefined;
    }
}
