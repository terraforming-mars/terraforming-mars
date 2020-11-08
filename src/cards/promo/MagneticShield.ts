import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class MagneticShield implements IProjectCard {
    public name = CardName.MAGNETIC_SHIELD;
    public cost = 26;
    public tags = [Tags.SPACE];
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        const hasEnergyTags = player.getTagCount(Tags.ENERGY) >= 2;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 4, game, false, true) && hasEnergyTags;
        }
  
        return hasEnergyTags;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(4, game);
        return undefined;
    }
}
