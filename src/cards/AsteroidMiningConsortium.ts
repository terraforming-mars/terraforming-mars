
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AsteroidMiningConsortium implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Asteroid Mining Consortium";
    public text: string = "Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step. Gain 1 victory point.";
    public description: string = "Your hold on the titanium market tightens.";
    public play(player: Player, game: Game): Promise<void> {
        if (player.titaniumProduction < 1) {
            return Promise.reject("Requires that you have titanium production");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayer"
            }, (playerId: string) => {
                const foundPlayer = game.getPlayerById(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                foundPlayer.titaniumProduction = Math.max(0, foundPlayer.titaniumProduction - 1);
                player.titaniumProduction++;
                player.victoryPoints++;
                resolve();
            });
        });
    }
}
