
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
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space with a steel or titanium placement bonus", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                if (foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1) {
                    player.steelProduction++;
                }
                if (foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                    player.titaniumProduction++;
                }
                resolve();
            }));
        });
    }
}  
