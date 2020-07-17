import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { Resources } from "../../Resources";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class PROffice implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.PR_OFFICE;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            const meetsPartyRequirements = game.turmoil.canPlay(player, PartyName.UNITY);
            if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
                return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsPartyRequirements;
            }

            return meetsPartyRequirements;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRating(game);
        let amount = player.getTagCount(Tags.EARTH) + 1;
        player.setResource(Resources.MEGACREDITS, amount);
        return undefined;
    }
}