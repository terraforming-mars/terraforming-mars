import { TileType } from "../TileType";
import { Color } from "../Color";
import Vue from "vue";
import { CardName } from "../CardName";

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
                // Convert card name to correct css class
                ret += tileDetails.toLowerCase().replace(" ", "_");
            }

            ret += " board_tile_pos--" + app.space.id.toString();
            return ret
        }

        let getVerboseTitle = (tileDetails: string): string => {
            let ret: string = ""; 
            if (tileDetails === CardName.MOHOLE_AREA) {
                ret = "Mohole Area"
            } else if (tileDetails === CardName.COMMERCIAL_DISTRICT) {
                ret = "Commercial District: 1 VP per adjacent city tile"
            } else if (tileDetails === CardName.ECOLOGICAL_ZONE) {
                ret = "Ecological Zone: 1 VP per 2 Animals on this card"
            } else if (tileDetails === CardName.INDUSTRIAL_CENTER) {
                ret = "Industrial Center"
            } else if (tileDetails === CardName.LAVA_FLOWS) {
                ret = "Lava Flows"
            } else if (tileDetails === CardName.MINING_AREA) {
                ret = "Mining Area"
            } else if (tileDetails === CardName.MINING_RIGHTS) {
                ret = "Mining Rights"
            } else if (tileDetails === CardName.NATURAL_PRESERVE) {
                ret = "Natural Preserve"
            } else if (tileDetails === CardName.NUCLEAR_ZONE) {
                ret = "Nuclear Zone"
            } else if (tileDetails === CardName.RESTRICTED_AREA) {
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