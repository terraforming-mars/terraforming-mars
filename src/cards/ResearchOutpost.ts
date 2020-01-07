
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
    public name: string = "Research Outpost";
    public cardType: CardType = CardType.ACTIVE;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => {
                    const adjacentSpaces = game.board.getAdjacentSpaces(space);
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
