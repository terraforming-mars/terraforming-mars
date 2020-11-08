import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class SpinInducingAsteroid implements IProjectCard {
    public cost = 16;
    public tags = [Tags.SPACE];
    public name = CardName.SPIN_INDUCING_ASTEROID;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        const meetsVenusRequirements = game.getVenusScaleLevel() - (2 * player.getRequirementsBonus(game, true)) <= 10;
        
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2, game, false, true) && meetsVenusRequirements;
        }
  
        return meetsVenusRequirements;
    }

    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,2);
        return undefined;
    }

}