import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class PoliticalAlliance implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.POLITICAL_ALLIANCE;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            const parties = game.turmoil.parties.filter(party => party.partyLeader === player.id);
            return parties.length > 1;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRating(game);
        return undefined;
    }
}
