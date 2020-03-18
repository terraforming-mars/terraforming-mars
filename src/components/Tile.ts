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

        let build_tile_css_class = (tile_type: TileType, tileDetails: string = ""):string => {
            var ret = "board_tile board_tile--";
            if (tile_type == TileType.GREENERY) {
                ret += "greenery";
            } else if (tile_type == TileType.OCEAN) {
                ret += "ocean";
            } else if (tile_type == TileType.CITY) {
                ret += "city";
            } else if (tile_type == TileType.SPECIAL) {
                ret += tileDetails;
            }

            ret += " board_tile_pos--" + app.space.id.toString();
            return ret
        }

        let getVerboseTitle = (tileDetails: string): string => {
            let ret: string = ""; 
            if (tileDetails === "mohole") {
                ret = "Project Mohole"
            } else if (tileDetails === "commercial_district") {
                ret = "Commercial District: 1 VP per adjacent city tile"
            } else if (tileDetails === "ecological_zone") {
                ret = "Ecological Zone: 1 VP per 2 Animals on this card"
            } else if (tileDetails === "industrial_center") {
                ret = "Industrial Center"
            } else if (tileDetails === "lava_flows") {
                ret = "Lava Flows"
            } else if (tileDetails === "mining_area") {
                ret = "Mining Area"
            } else if (tileDetails === "mining_rights") {
                ret = "Mining Rights"
            } else if (tileDetails === "natural_preserve") {
                ret = "Natural Preserve"
            } else if (tileDetails === "nuclear_zone") {
                ret = "Nuclear Zone"
            } else if (tileDetails === "restricted_area") {
                ret = "Restricted Area"
            }
            return ret;
        }

        let tile_type = this.space.tileType;
        if (tile_type !== undefined) {
            tile_elements.push(
                createElement("i", {
                    "class": build_tile_css_class(tile_type, this.space.tileDetails),
                    "attrs": {"title": getVerboseTitle(this.space.tileDetails)}
                })
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