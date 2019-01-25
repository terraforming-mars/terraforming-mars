
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class TitaniumMine implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Titanium Mine";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your titanium production 1 step";
    public description: string = "Titanium is useful to the space industry because of its great strength";
    public play(player: Player, _game: Game): Promise<void> {
        player.titaniumProduction++;
        return Promise.resolve();
    }
}
