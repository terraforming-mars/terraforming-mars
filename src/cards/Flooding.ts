
import { IProjectCard } from "./IProjectCard";
import { IUserData } from "../IUserData";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class Flooding implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 7;
    public name: string = "Flooding";
    public tags: Array<Tags> = [];
    public text: string = "Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MEGA CREDITS FROM THE OWNER OF ONE OF THOSE TILES";
    public description: string = "Look out for tsunamis";
    public needsUserData: IUserData = {
        playerId: "Which player to remove from ",
        spaceId: "Where to place ocean tile"
    };
    public play(player: Player, game: Game, userData: IUserData): void {
        var space = game.getSpace(userData.spaceId);
        var adjacentPlayers = game.getAdjacentSpaces(space).filter((space) => space.player && space.player.id === userData.playerId);
        if (adjacentPlayers.length === 0) {
            throw "Player " + userData.playerId + " doesn't own an adjacent space";
        }
        game.addOceanTile(player, userData.spaceId);
        adjacentPlayers[0].player.megaCredits -= 4;
        player.victoryPoints--;
    }
}
