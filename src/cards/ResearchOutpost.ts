
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SpaceType } from "../SpaceType";
import { ISpace } from "../ISpace";

export class ResearchOutpost implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.CITY, Tags.STEEL];
    public name: string = "Research Output";
    public text: string = "When you play a card, you pay 1 mega credit less for it. Place a city tile next to no other tile.";
    public cardType: CardType = CardType.ACTIVE;
    public description: string = "Finding new ways to do things.";
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.getAvailableSpacesOnLand(player)
                .filter((space) => {
                    const adjacentSpaces = game.getAdjacentSpaces(space);
                    return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
                });
    }
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this.name, "Select place next to no other tile for city", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
                if (foundSpace.spaceType === SpaceType.COLONY) {
                    reject("Must be places on mars");
                    return;
                }
                const adjacentSpaces = game.getAdjacentSpaces(foundSpace);
                if (adjacentSpaces.filter((adjacentSpace) => adjacentSpace.tile !== undefined).length > 0) {
                    reject("Space must be next to no other tile");
                    return;
                }
                try { game.addCityTile(player, foundSpace.id); }
                catch (err) { reject(err); return; }
                player.addCardDiscount(() => {
                    return 1;
                });
                resolve();
            }));
        });
    }
}
