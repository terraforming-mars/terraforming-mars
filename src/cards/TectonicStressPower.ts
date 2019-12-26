
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TectonicStressPower implements IProjectCard {
    public cost: number = 18;
     public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Tectonic Stress Power";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, _game: Game): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 2) {
            throw "Requires 2 science tags";
        }
        player.energyProduction += 3;
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
