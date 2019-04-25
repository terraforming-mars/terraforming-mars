
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceBonus } from "../SpaceBonus";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";

export class MiningRights implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mining Rights";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Place a special tile on an area with a steel or titanium placement bonus. Increase that production 1 step.";
    public description: string = "The battles for Martian riches sometimes begin in a courtroom.";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1);
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0
    }
    public play(player: Player, game: Game) {
        if (this.getAvailableSpaces(player, game).length === 0) {
            throw "No tiles available with placement bonus";
        }
        return new SelectSpace(this.name, "Select space with a steel or titanium placement bonus", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL });
            if (foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1) {
                player.steelProduction++;
            }
            if (foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                player.titaniumProduction++;
            }
            return undefined;
        });
    }
}
