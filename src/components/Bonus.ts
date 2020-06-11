import Vue from "vue";
import { SpaceBonus } from "../SpaceBonus";

export const Bonus = Vue.component("bonus", {
    props: ["bonus"],
    data: function () {
        return {}
    },
    render: function (createElement) {
        let bonuses = [];
        let idx = 0;

        let build_css_class = (idx: number, bonus: SpaceBonus):string => {
            var ret = "board-space-bonus board-space-bonus--";
            if (bonus == SpaceBonus.TITANIUM) {
                ret += "titanium";
            } else if (bonus == SpaceBonus.STEEL) {
                ret += "steel";
            } else if (bonus == SpaceBonus.PLANT) {
                ret += "plant";
            } else if (bonus == SpaceBonus.DRAW_CARD) {
                ret += "card";
            } else if (bonus == SpaceBonus.HEAT) {
                ret += "heat";
             }else if (bonus == SpaceBonus.OCEAN) {
                ret += "bonusocean";
            }
            ret += " board-space-bonus-pos--" + idx.toString();
            return ret
        }

        for (let bonus of this.bonus) {
            idx += 1;
            bonuses.push(
                createElement("i", {"class": build_css_class(idx, bonus)})
            )
        }
        return createElement("div", {"class": "board-space-bonuses"}, bonuses);
    }
});