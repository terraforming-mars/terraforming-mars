import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class NitrogenRichAsteroid implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.NITROGEN_RICH_ASTEROID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        let steps = 2;
        if (game.getTemperature() < MAX_TEMPERATURE) steps++;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(this.cost + REDS_RULING_POLICY_COST * steps, game, false, true);
        }
      
        return true;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(2, game);
        if (player.getTagCount(Tags.PLANT) < 3) {
            player.setProduction(Resources.PLANTS);
        } else {
            player.setProduction(Resources.PLANTS,4);
        }
        return game.increaseTemperature(player, 1);
    }
}
