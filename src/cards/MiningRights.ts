
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
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select space with a steel or titanium placement bonus", (foundSpace: ISpace) => {
                const hasSteelBonus = foundSpace.bonus && foundSpace.bonus.indexOf(SpaceBonus.STEEL) !== -1;
                const hasTitaniumBonus = foundSpace.bonus && foundSpace.bonus.indexOf(SpaceBonus.TITANIUM) !== -1;
                if (!hasSteelBonus && !hasTitaniumBonus) {
                    reject("Space needs steel or titanium bonus");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
                if (hasSteelBonus) {
                    player.steelProduction++;
                }
                if (hasTitaniumBonus) {
                    player.titaniumProduction++;
                }
                resolve();
            }));
        });
    }
}  
