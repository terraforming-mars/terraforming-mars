
import Vue, { VNode } from "vue";
import { PlayerInputModel } from "../models/PlayerInputModel";


export const SelectSpace = Vue.component("select-space", {
    props: ["playerinput", "onsave", "showtitle"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        if (this.showtitle) {
            children.push(createElement("div", playerInput.title));
        }

        const clearAllAvailableSpaces = function() {
            const elTiles = document.getElementsByClassName("board_space");
            for (let i = 0; i < elTiles.length; i++) {
                elTiles[0].classList.remove("board_space--available");
            }
        };


        const setOfSpaces: {[x: string]: boolean} = {};
        if (playerInput.availableSpaces !== undefined) {
            playerInput.availableSpaces.forEach((spaceId: string) => {
                setOfSpaces[spaceId] = true;
            });
            children.push(createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => {
                clearAllAvailableSpaces();
                const elTiles = document.getElementsByClassName("board_space");
                for (let i = 0; i < elTiles.length; i++) {
                    const elTile = elTiles[i] as HTMLElement;
                    var el_id = elTile.getAttribute("data_space_id");
                    if ( ! el_id || ! setOfSpaces[el_id]) continue;
                    
                    elTile.classList.add("board_space--available");

                    elTile.onclick = () => {
                        clearAllAvailableSpaces();
                        for (let j = 0; j < elTiles.length; j++) {
                            (elTiles[j] as HTMLElement).onclick = null;
                        }
                        el_id = elTile.getAttribute("data_space_id");
                        this.onsave([[el_id]]);
                    }
                }
            } } }, "Select Space"));
        }
        return createElement("div", children);
    }
});

