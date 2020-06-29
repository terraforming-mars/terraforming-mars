import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class VoteOfNoConfidence implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.VOTE_OF_NO_CONFIDENCE;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            const parties = game.turmoil.parties.filter(party => party.partyLeader === player.id);
            return game.turmoil.chairman === "NEUTRAL" && parties.length > 0 &&  game.turmoil.delegate_reserve.indexOf(player.id) > -1;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        if (game.turmoil !== undefined) {
            game.turmoil.chairman! = player.id;
            const index = game.turmoil.delegate_reserve.indexOf(player.id);
            if (index > -1) {
                game.turmoil.delegate_reserve.splice(index, 1);
            }
            player.increaseTerraformRating(game);
        }
        return undefined;
    }
}