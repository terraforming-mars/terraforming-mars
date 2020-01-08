import { SpaceModel } from "../models/SpaceModel";
import { SpaceType } from "../SpaceType";

// Common code for Board and Venus components

export const BoardMixin = {
    "methods": {
        getSpacesWithTile: function(): Array<SpaceModel> {
            const boardSpaces: Array<SpaceModel> = (this as any).spaces.filter(
                (space: SpaceModel) => space.tileType != undefined || space.color != undefined
            );
            boardSpaces.sort((s1: any, s2: any) => {return s1.id - s2.id});
            return boardSpaces;
        },
        getStroke: function(space: SpaceModel): string {
            return (space.spaceType == SpaceType.OCEAN) ? '#1bade0': '#fff';
        },
        getPosCssClass: function(space: SpaceModel): string {
            return "board_space_pos--" + space.id.toString();
        },
        getKey: function(prefix: string, space: SpaceModel): string {
            return prefix + "_component_item_" + space.id.toString();
        }
    }
}