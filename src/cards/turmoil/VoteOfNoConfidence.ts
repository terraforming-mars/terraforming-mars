import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';

export class VoteOfNoConfidence implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.VOTE_OF_NO_CONFIDENCE;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            const parties = game.turmoil.parties.filter(party => party.partyLeader === player);
            return game.turmoil.chairman === "NEUTRAL" && parties.length > 0;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        if (game.turmoil !== undefined) {
            game.turmoil.chairman! = player;
            player.increaseTerraformRating(game);
        }
        return undefined;
    }
}