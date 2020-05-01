import { TileType } from "../TileType";
import { Color } from "../Color";
import Vue from "vue";

let tileTypeToCssClass = new Map<TileType, string>([
    [TileType.COMMERCIAL_DISTRICT, "commercial_district"],
    [TileType.ECOLOGICAL_ZONE, "ecological_zone"],
    [TileType.INDUSTRIAL_CENTER, "industrial_center"],
    [TileType.LAVA_FLOWS, "lava_flows"],
    [TileType.MINING_AREA, "mining_area"],
    [TileType.MINING_RIGHTS, "mining_rights"],
    [TileType.MOHOLE_AREA, "mohole_area"],
    [TileType.NATURAL_PRESERVE, "natural_preserve"],
    [TileType.NUCLEAR_ZONE, "nuclear_zone"],
    [TileType.RESTRICTED_AREA, "restricted_area"]
]);

export const Tile = Vue.component("bonus", {
    props: ["space"],
    data: function () {
        return {}
    },
    render: function (createElement) {
        let tileElements = [];
        let app = this;

        let buildTileCssClass = (tileType: TileType):string => {
            var ret = "board_tile board_selectable board_tile--";
            if (tileType === TileType.GREENERY) {
                ret += "greenery";
            } else if (tileType === TileType.OCEAN) {
                ret += "ocean";
            } else if (tileType === TileType.CITY) {
                ret += "city";
            } else {
                ret += tileTypeToCssClass.get(tileType);
            }

            ret += " board_tile_pos--" + app.space.id.toString();
            return ret
        }

        let getVerboseTitle = (tileType: TileType): string => {
            let ret: string = ""; 
            if (tileType === TileType.MOHOLE_AREA) {
                ret = "Mohole Area"
            } else if (tileType === TileType.COMMERCIAL_DISTRICT) {
                ret = "Commercial District: 1 VP per adjacent city tile"
            } else if (tileType === TileType.ECOLOGICAL_ZONE) {
                ret = "Ecological Zone: 1 VP per 2 Animals on this card"
            } else if (tileType === TileType.INDUSTRIAL_CENTER) {
                ret = "Industrial Center"
            } else if (tileType === TileType.LAVA_FLOWS) {
                ret = "Lava Flows"
            } else if (tileType === TileType.MINING_AREA) {
                ret = "Mining Area"
            } else if (tileType === TileType.MINING_RIGHTS) {
                ret = "Mining Rights"
            } else if (tileType === TileType.NATURAL_PRESERVE) {
                ret = "Natural Preserve"
            } else if (tileType === TileType.NUCLEAR_ZONE) {
                ret = "Nuclear Zone"
            } else if (tileType === TileType.RESTRICTED_AREA) {
                ret = "Restricted Area"
            }
            return ret;
        }

        let tileType: TileType = this.space.tileType;
        if (tileType !== undefined) {
            tileElements.push(
                createElement("i", {
                    "class": buildTileCssClass(tileType),
                    "attrs": {"title": getVerboseTitle(tileType), "data_space_id": this.space.id}
                })
            )
        }

        let buildPlayerCssClass = (player_color: Color):string => {
            var ret = "board_cube board_cube--";
            ret += player_color;
            ret += " board_cube_pos--" + app.space.id.toString();
            return ret
        }

        let color = this.space.color;

        if (color) {
            tileElements.push(
                createElement("i", {"class": buildPlayerCssClass(color)})
            )
        }
        
        return createElement("span", tileElements);
    }
});
