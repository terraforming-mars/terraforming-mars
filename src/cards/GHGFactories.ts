
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { Resources } from "../Resources";


export class GHGFactories implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "GHG Factories";
    public canPlay(player: Player): boolean {
        return player.energyProduction >= 1;
    }
    public play(player: Player, _game: Game) {
        if (player.energyProduction < 1) {
            throw "Must have energy production to decrease";
        }
        player.energyProduction--;
        player.setProduction(Resources.HEAT,4);
        return undefined;
    }
}

