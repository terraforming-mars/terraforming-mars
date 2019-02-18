
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class IceAsteroid implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Ice Asteroid";
    public text: string = "Place 2 ocean tiles";
    public description: string = "We need its water down here";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new AndOptions(
                    () => { resolve(); },
                    new SelectSpace(this.name, "Select first ocean space", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); }
                    }),
                    new SelectSpace(this.name, "Select second ocean space", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); }
                    })
                )
            );
        });
    }
}
