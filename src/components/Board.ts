
import Vue from "vue";
import { SpaceBonus } from "../SpaceBonus";
import { SpaceName } from "../SpaceName";
import { SpaceType } from "../SpaceType";
import { TileType } from "../TileType";

export const Board = Vue.component("board", {
    props: ["spaces"],
    data: function () {
        return {}
    },
    render: function (createElement) {
        const boardSpaces = this.spaces.filter((space: any) => space.x >= 0 && space.y >= 0);
        boardSpaces.sort((s1: any, s2: any) => {
            if (s1.y === s2.y) {
                return s1.x - s2.x;
            }
            return s1.y - s2.y;
        });
        const spaces = [];
        let lastY: number | undefined = undefined;
        const elGanymede = createElement("div", {
            style: {
                position: "absolute",
                left: "0px",
                top: "10px"
            }
        }, [
            createElement("span", { class: "tile" }, [
                createElement("span", { class: "colony", domProps: { innerHTML: "&#x2B22" }}),
                createElement("span", { class: "name" }, "GANYMEDE_COLONY")
            ])
        ]);
        spaces.push(elGanymede);
        let cells = [];
        let leftPadding: number = 0;
        while (boardSpaces.length) {
            const thisSpace = boardSpaces.shift();
            if (lastY === undefined || thisSpace.y !== lastY) {
                if (cells.length > 0) {
                    spaces.push(createElement("div", { class: "row", style: { paddingLeft: (25 * leftPadding) + "px" }}, cells));
                    cells = [];
                }
                leftPadding = thisSpace.x;
            }
            const cellChildren = [];
            function getClassName() {
                if (thisSpace.tile !== undefined && thisSpace.tile.tileType === TileType.GREENERY) {
                    return "greenery";
                } else if (thisSpace.tile !== undefined && thisSpace.tile.tileType === TileType.CITY) {
                    return "city";
                } else if (thisSpace.tile !== undefined && thisSpace.tile.tileType === TileType.OCEAN) {
                    return "ocean";
                } else if (thisSpace.tile !== undefined && thisSpace.tile.tileType === TileType.SPECIAL) {
                    return "special";
                } else if (thisSpace.spaceType === SpaceType.LAND) {
                    return "land";
                } else if (thisSpace.spaceType === SpaceType.OCEAN) {
                    return "aquifer";
                }
                return "";
            }
            cellChildren.push(createElement("span", { class: getClassName(), domProps: { innerHTML: "&#x2B22"}}));
            if (thisSpace.tile === undefined) {
                thisSpace.bonus.forEach((bonus: any) => {
                    let className: string = "bonus";
                    let innerHTML: string = "";
                    if (bonus === SpaceBonus.TITANIUM) {
                        innerHTML = "&#x272A";
                    } else if (bonus === SpaceBonus.STEEL) {
                        innerHTML = "&#x2692";
                        className += " steel";
                    } else if (bonus === SpaceBonus.PLANT) {
                        innerHTML = "&#x1F343";
                        className += " plane";
                    } else if (bonus === SpaceBonus.DRAW_CARD) {
                        innerHTML = "&#x1F0A0";
                    }
                    cellChildren.push(createElement("span", { class: className, domProps: { innerHTML: innerHTML }}));
                });
            }
            if (thisSpace.player !== undefined) {
                cellChildren.push(createElement("span", { class: thisSpace.player.color }));
            }
            if (thisSpace.id === SpaceName.ARSIA_MONS ||
                thisSpace.id === SpaceName.ASCRAEUS_MONS ||
                thisSpace.id === SpaceName.NOCTIS_CITY ||
                thisSpace.id === SpaceName.PAVONIS_MONS ||
                thisSpace.id === SpaceName.THARSIS_THOLUS) {
                cellChildren.push(createElement("span", { class: "name" }, thisSpace.id));
            }
            cells.push(createElement("div", { class: "tile", attrs: { id: thisSpace.id } }, cellChildren));
            lastY = thisSpace.y;
        }
        spaces.push(createElement("div", { class: "row", style: { paddingLeft: (25 * leftPadding) + "px" }}, cells));
        spaces.push(createElement("div", {
            style: {
                position: "absolute",
                left: "0px",
                top: "360px"
            }}, [
                createElement("span", { class: "tile" }, [
                    createElement("span", { class: "colony", domProps: { innerHTML: "&#x2B22" }}),
                    createElement("span", { class: "name" }, "PHOBOS_SPACE_HAVEN")
                ])
            ]));
        return createElement("div", { class: "board" }, spaces);
  }
});


