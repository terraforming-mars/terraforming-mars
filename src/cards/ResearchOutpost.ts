
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInput } from "../PlayerInput";
import { CardName } from '../CardName';
import { AresHandler, HazardSeverity } from "../ares/AresHandler";

export class ResearchOutpost implements IProjectCard {
    public cost = 18;
    public tags = [Tags.SCIENCE, Tags.CITY, Tags.STEEL];
    public name = CardName.RESEARCH_OUTPOST;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;
    private getAvailableSpaces(player: Player, game: Game, addCardCost: boolean = true): Array<ISpace> {
        return game.board.getAvailableSpacesOnLand(player)
                .filter((space) => {
                    const adjacentSpaces = game.board.getAdjacentSpaces(space);
                    const spaceIsAvailable = adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
                    if (game.gameOptions.aresExtension && AresHandler.hasHazardTile(space)) {
                        const cost = (addCardCost ? this.cost : 0) + (AresHandler.hazardSeverity(space) === HazardSeverity.MILD ? 8 : 16);
                        return spaceIsAvailable && player.canAfford(cost);
                    } else {
                        return spaceIsAvailable;
                    }
                });
    }
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableSpaces(player, game).length > 0;
    }
    public getCardDiscount() {
        return 1;
    }
    public play(player: Player, game: Game): PlayerInput {
        return new SelectSpace("Select place next to no other tile for city", this.getAvailableSpaces(player, game, false), (foundSpace: ISpace) => {
            game.addCityTile(player, foundSpace.id);
            return undefined;
        });
    }
}
