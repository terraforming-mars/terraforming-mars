import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class NitrogenFromTitan implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.NITROGEN_FROM_TITAN;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) : boolean {
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2, game, false, true);
        }

        return true;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(2, game);
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN));
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}

