import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";

export class EstateDealer implements IAward {
    public name: string = "EstateDealer";
    public description: string = "Most tiles adjacent to ocean tiles"
    public getScore(player: Player, game: Game): number {
        return game.board.spaces
          .filter((space) => (space.player !== undefined && space.player === player && space.tile !== undefined) 
                               && game.board.getAdjacentSpaces(space)
                               .filter((space) => space.spaceType === SpaceType.OCEAN).length > 0
                               ).length;
    }   
}