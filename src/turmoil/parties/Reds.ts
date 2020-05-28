import { IParty } from "./IParty";
import { Party } from "./Party";
import { PartyName } from "./PartyName";
import { Game } from "../../Game";
import { Player } from "../../Player";

export class Reds extends Party implements IParty {
    public name = PartyName.REDS;
    public description: string = "The player with the lowest TR gains 1 TR. Ties are friendly.";

    public rulingBonus(game: Game): void {
        if (game.getPlayers().length > 1) {
            const players: Array<Player> = game.getPlayers();
            players.sort(
                (p1, p2) => p1.getTerraformRating() - p2.getTerraformRating()
            );
            const min = players[0].getTerraformRating();
            while (players.length > 0 && players[0].getTerraformRating() === min) {
                players[0].increaseTerraformRating(game);
                players.shift();
            }
        }
        // Different ruling if we only have on player
        else {
            const player = game.getPlayers()[0];
            if(player.getTerraformRating() < 20) {
                player.increaseTerraformRating(game);
            }
        }
    }
}
