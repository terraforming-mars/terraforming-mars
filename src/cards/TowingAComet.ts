
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class TowingAComet implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Towing A Comet";
    public text: string = "Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.";
    public description: string = "By aerobraking it we get its contents without the impact.";
    public canPlay(_player: Player, _game: Game): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace(this.name, "Select place for oean", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            game.addOceanTile(player, foundSpace.id)
            player.plants += 2;
            return game.increaseOxygenLevel(player, 1);
        });
    }
}
