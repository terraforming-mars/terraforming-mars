import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { Tags } from "../../cards/Tags";
import { Resources } from "../../Resources";

export class Reds extends Party implements IParty {
    public name = PartyName.REDS;
    public description: string = "The player with the lowest TR gains 1 TR. Ties are friendly.";

    public rulingBonus(game: Game): void {
        if (game.getPlayers().length > 1) {
            const players: Array<Player> = game.getPlayers();
            players.sort(
                (p1, p2) => p1.terraformRating - p2.terraformRating
            );
            const min = players[0].terraformRating;
            while (players.length > 0 && players[0].terraformRating === min) {
                players[0].terraformRating += 1;
                players.shift();
            }
        }
        // Different ruling if we only have on player
        else {
            const player = game.getPlayers()[0];
            if(player.terraformRating < 20) {
                player.terraformRating += 1;
            }
        }
    }
}
