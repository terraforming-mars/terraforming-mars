
import Vue, { VNode } from "vue";
import { PlayerInputModel } from "../models/PlayerInputModel";

export const SelectSpace = Vue.component("select-space", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        children.push(createElement("div", playerInput.title));
        const setOfSpaces: {[x: string]: number} = {};
        if (playerInput.availableSpaces !== undefined) {
            playerInput.availableSpaces.forEach((spaceId: string) => {
                setOfSpaces[spaceId] = 1;
            });
            children.push(createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => {
                const elTiles = document.getElementsByClassName("tile");
                for (let i = 0; i < elTiles.length; i++) {
                    const elTile = elTiles[i] as HTMLElement;
                    if (setOfSpaces[String(elTile.getAttribute("id"))] === 1) {
                        elTile.onmouseover = function () {
                            elTile.style.border = "1px solid black";
                            elTile.style.cursor = "pointer";
                        }
                        elTile.onmouseout = function () {
                            elTile.style.border = "0px solid black";
                            elTile.style.cursor = "default";
                        }
                        elTile.onclick = () => {
                            for (let j = 0; j < elTiles.length; j++) {
                                (elTiles[j] as HTMLElement).onmouseover = null;
                                (elTiles[j] as HTMLElement).onmouseout = null;
                                (elTiles[j] as HTMLElement).onclick = null;
                            }
                            this.onsave([[String(elTile.getAttribute("id"))]]);
                        }
                    }
                }
            } } }, "Select Space"));
        }
        return createElement("div", children);
    }
});

