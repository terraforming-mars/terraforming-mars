import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class Omnicourt implements IProjectCard {
    public cost = 11;
    public tags = [Tags.STEEL];
    public name = CardName.OMNICOURT;
    public cardType = CardType.AUTOMATED;
    
    public canPlay(player: Player, game: Game): boolean {
      const hasRequiredTags = player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2, game, true) && hasRequiredTags;
      }

      return hasRequiredTags;
  }
    
    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(2, game);
      return undefined;
    }
}
