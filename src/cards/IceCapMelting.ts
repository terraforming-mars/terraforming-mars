
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";

export class IceCapMelting implements IProjectCard {
    public cost: number = 5;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = "Ice Cap Melting";
    public text: string = "Requires +2C or warmer. Place 1 ocean tile.";
    public description: string = "Getting the water back from the poles.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.getTemperature() < 2) {
                reject("not warm enough, must be +2C or warmer");
                return;
            }
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (input: string) => {
                try { game.addOceanTile(player, input); }
                catch (err) { reject(err); return; }
            });
        });
    }
}
