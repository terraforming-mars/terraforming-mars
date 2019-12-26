
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class LightningHarvest implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Lightning Harvest";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 3) {
            throw "Requires 3 science tags";
        }
        player.energyProduction++;
        player.megaCreditProduction++;
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
