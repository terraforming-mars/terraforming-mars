
import { Dealer } from "./Dealer";
import { Game } from "./Game";
import * as fs from "fs";

type SimplePOJO = {[x: string]: Array<string> | string | number};

export class DataAccessObject {
    public putDealer(dealer: Dealer): SimplePOJO {
        return {
            deck: dealer.deck.map((card) => card.name),
            discarded: dealer.discarded.map((card) => card.name)
        };
    }

    public putGame(game: Game): void {
        var output = {
            activePlayer: game.activePlayer.id,
            claimedMilestones: game.claimedMilestones.map((cm) => ({
                milestone: cm.milestone,
                player: cm.player.id
            })),
            dealer: this.putDealer(game.dealer),
            fundedAwards: game.fundedAwards.map((fa) => ({
                award: fa.award,
                player: fa.player.id
            }))
        };
        fs.writeFileSync("game.dat", JSON.stringify(output));
    }
}
