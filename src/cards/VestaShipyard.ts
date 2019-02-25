
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class VestaShipyard implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Vesta Shipyard";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your titanium production 1 step";
    public description: string = "The pride of the asteroid belt";
    public play(player: Player, _game: Game): undefined {
        player.titaniumProduction++;
        return undefined;
    }
}
