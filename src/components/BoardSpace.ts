import Vue from "vue";
import {Bonus} from "./Bonus";
import { TileType } from "../TileType";
import { $t } from "../directives/i18n";

let tileTypeToCssClass = new Map<TileType, string>([
    [TileType.COMMERCIAL_DISTRICT, "commercial_district"],
    [TileType.ECOLOGICAL_ZONE, "ecological_zone"],
    [TileType.INDUSTRIAL_CENTER, "industrial_center"],
    [TileType.LAVA_FLOWS, "lava_flows"],
    [TileType.MINING_AREA, "mining_area"],
    [TileType.MINING_RIGHTS, "mining_rights"],
    [TileType.CAPITAL, "capital"],
    [TileType.MOHOLE_AREA, "mohole_area"],
    [TileType.NATURAL_PRESERVE, "natural_preserve"],
    [TileType.NUCLEAR_ZONE, "nuclear_zone"],
    [TileType.RESTRICTED_AREA, "restricted_area"],
    [TileType.DEIMOS_DOWN, "deimos_down"],
    [TileType.GREAT_DAM, "great_dam"],
    [TileType.MAGNETIC_FIELD_GENERATORS, "magnetic_field_generators"],
    [TileType.BIOFERTILIZER_FACILITY, "biofertilizer_facility"],
    [TileType.METALLIC_ASTEROID, "metallic_asteroid"],
    [TileType.SOLAR_FARM, "solar_farm"],
    [TileType.OCEAN_CITY, "ocean_city"],
    [TileType.OCEAN_FARM, "ocean_farm"],
    [TileType.OCEAN_SANCTUARY, "ocean_sanctuary"],
    [TileType.DUST_STORM_MILD, "dust_storm_mild"],
    [TileType.DUST_STORM_SEVERE, "dust_storm_severe"],
    [TileType.EROSION_MILD, "erosion_mild"],
    [TileType.EROSION_SEVERE, "erosion_severe"],
]);

let tileTypeToCssClassAresOverride = new Map<TileType, string>([
    [TileType.COMMERCIAL_DISTRICT, "commercial_district_ares"],
    [TileType.ECOLOGICAL_ZONE, "ecological_zone_ares"],
    [TileType.INDUSTRIAL_CENTER, "industrial_center_ares"],
    [TileType.LAVA_FLOWS, "lava_flows_ares"],
    [TileType.MINING_AREA, "mining_area_ares"],
    [TileType.MINING_RIGHTS, "mining_rights_ares"],
    [TileType.CAPITAL, "capital_ares"],
    [TileType.MOHOLE_AREA, "mohole_area_ares"],
    [TileType.NATURAL_PRESERVE, "natural_preserve_ares"],
    [TileType.NUCLEAR_ZONE, "nuclear_zone_ares"],
    [TileType.RESTRICTED_AREA, "restricted_area_ares"],
]);

export const BoardSpace = Vue.component("board-space", {
    props: ["space", "text", "is_selectable", "aresExtension"],
    data: function () {
        return {}
    },
    components: {
        "bonus": Bonus
    },
    methods: {
        getVerboseTitle: function (tileType: TileType): string {
            let ret: string = ""; 
            if (tileType === TileType.MOHOLE_AREA) {
                ret = "Mohole Area"
            } else if (tileType === TileType.COMMERCIAL_DISTRICT) {
                ret = "Commercial District: 1 VP per adjacent city tile"
            } else if (tileType === TileType.ECOLOGICAL_ZONE) {
                ret = "Ecological Zone"
            } else if (tileType === TileType.INDUSTRIAL_CENTER) {
                ret = "Industrial Center"
            } else if (tileType === TileType.LAVA_FLOWS) {
                ret = "Lava Flows"
            } else if (tileType === TileType.CAPITAL) {
                ret = "Capital"
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
            } else if (tileType === TileType.GREAT_DAM) {
                ret = "Great Dam"
            } else if (tileType === TileType.MAGNETIC_FIELD_GENERATORS) {
                ret = "Magnetic field generators"
            } else if (tileType === TileType.DEIMOS_DOWN) {
                ret = "Deimos Down"
            } else if (tileType === TileType.CITY) {
                ret = "City: 1 VP per adjacent greenery";
            } else if (tileType === TileType.GREENERY) {
                ret = "Greenery: 1 VP";
            }
            return $t(ret);
        },
        getMainClass: function (): string {
            let css = "board-space board-space-" + this.space.id.toString();
            if (this.is_selectable) {
                css += " board-space-selectable"
            }
            var tileType = this.space.tileType;
            if (tileType !== undefined) {
                switch (tileType) {
                    case TileType.OCEAN:
                        css += " board-space-tile--ocean";
                        break;
                    case TileType.CITY:
                        css += " board-space-tile--city";
                        break;
                    case TileType.GREENERY:
                        css += " board-space-tile--greenery";
                        break;
                    default:

                        let cssClass = tileTypeToCssClass.get(tileType);
                        if (this.aresExtension && tileTypeToCssClassAresOverride.has(tileType)) {
                            cssClass = tileTypeToCssClassAresOverride.get(tileType)
                        }
                        css += " board-space-tile--" + cssClass
                }
            } else {
                if (this.space.spaceType === "ocean") {
                    css += " board-space-type-ocean"
                } else {
                    css += " board-space-type-land"
                }
            }

            return css;
        }
    },
    template: `
        <div :class="getMainClass()" :data_space_id="space.id" :title="getVerboseTitle(space.tileType)">
            <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
            <bonus :bonus="space.bonus" v-if="space.tileType === undefined"></bonus>
            <div :class="'board-cube board-cube--'+space.color" v-if="space.color !== undefined"></div>
        </div>
    `
});