
import { Game } from "./Game";
import * as fs from "fs";

/*
 create table Game
  id key string
  data string
 create table Player
  id key string
  data string
*/

export class DataAccessObject {
    public putGame(game: Game): void {
        var output = {
            activePlayer: game.activePlayer.id,
            claimedMilestones: game.claimedMilestones.map((cm) => ({
                milestone: cm.milestone,
                player: cm.player.id
            })),
            fundedAwards: game.fundedAwards.map((fa) => ({
                award: fa.award,
                player: fa.player.id
            }))
        };
        fs.writeFileSync("game.dat", JSON.stringify(output));
    }
}
