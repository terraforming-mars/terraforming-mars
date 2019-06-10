
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInput } from "../PlayerInput";

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
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0;
    }
    public getCardDiscount() {
        return 1;
    }
    public play(player: Player, game: Game): PlayerInput {
        return new SelectSpace("Select place next to no other tile for city", this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            return undefined;
        });
    }
}
