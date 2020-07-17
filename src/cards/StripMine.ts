import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class StripMine implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.STRIP_MINE;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 2;
        const remainingOxygenSteps = MAX_OXYGEN_LEVEL - game.getOxygenLevel();
        const stepsRaised = Math.min(remainingOxygenSteps, 2);
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * stepsRaised, game, true) && hasEnergyProduction;
        }

        return hasEnergyProduction;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.STEEL,2);
        player.setProduction(Resources.TITANIUM);
        return game.increaseOxygenLevel(player, 2);
    }
}
