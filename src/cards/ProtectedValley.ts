
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class ProtectedValley implements IProjectCard {
    public cost: number = 23;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Protected Valley";
    public text: string = "Increase your mega credit production 2 steps. Place a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.";
    public description: string = "A fertile valley with higher air density and humidity, but in need of protection when the oceans rise.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this, "Select space for greenery tile", (space: ISpace) => {
                try {
                    game.addGreenery(player, space.id, SpaceType.OCEAN);
                } catch (err) {
                    reject(err);
                    return;
                }
                player.megaCreditProduction += 2;
                resolve();
            }));
        });
    }
}
