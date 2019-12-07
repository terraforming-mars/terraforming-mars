import { TileType } from "../TileType";
import { Color } from "../Color";
import Vue from "vue";

export const Tile = Vue.component("bonus", {
    props: ["space"],
    data: function () {
        return {}
    },
    render: function (createElement) {
        let tile_elements = [];
        let app = this;

        let build_tile_css_class = (tile_type: TileType):string => {
            var ret = "board_tile board_tile--";
            if (tile_type == TileType.GREENERY) {
                ret += "greenery";
            } else if (tile_type == TileType.OCEAN) {
                ret += "ocean";
            } else if (tile_type == TileType.CITY) {
                ret += "city";
            } else if (tile_type == TileType.SPECIAL) {
                ret += "special";
            }

            ret += " board_tile_pos--" + app.space.id.toString();
            return ret
        }

        let tile_type = this.space.tileType;
        if (tile_type !== undefined) {
            tile_elements.push(
                createElement("i", {"class": build_tile_css_class(tile_type)})
            )
        }

        let build_player_css_class = (player_color: Color):string => {
            var ret = "board_cube board_cube--";
            ret += player_color;
            ret += " board_cube_pos--" + app.space.id.toString();
            return ret
        }

        let color = this.space.color;

        if (color) {
            tile_elements.push(
                createElement("i", {"class": build_player_css_class(color)})
            )
        }
        
        return createElement("span", tile_elements);
    }
});