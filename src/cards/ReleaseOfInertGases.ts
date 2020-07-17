import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../constants";

export class ReleaseOfInertGases implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.RELEASE_OF_INERT_GASES;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * 2);
        }
  
        return true;
      }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(2, game);
        return undefined;
    }
}
