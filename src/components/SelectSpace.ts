
import Vue, { VNode } from "vue";
import { PlayerInputModel } from "../models/PlayerInputModel";
import { $t } from "../directives/i18n";

export const SelectSpace = Vue.component("select-space", {
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            spaceId: undefined,
            warning: undefined
        };
    },
    methods: {
        saveData: function () {
            if (this.$data.spaceId === undefined) {
                this.$data.warning = "Must select a space";
                return;
            }
            this.onsave([[this.$data.spaceId]]);
        }
    },
    mounted: function() {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const setOfSpaces: {[x: string]: boolean} = {};

        if (playerInput.availableSpaces !== undefined) {
            playerInput.availableSpaces.forEach((spaceId: string) => {
                setOfSpaces[spaceId] = true;
            });
        }

        const clearAllAvailableSpaces = function() {
            const elTiles = document.getElementsByClassName("board-space-selectable");
            for (let i = 0; i < elTiles.length; i++) {
                elTiles[i].classList.remove("board-space--available");
                elTiles[i].classList.remove("board-space--selected");
            }
        };

        {
            clearAllAvailableSpaces();
            const elTiles = document.getElementsByClassName("board-space-selectable");
            for (let i = 0; i < elTiles.length; i++) {
                const elTile = elTiles[i] as HTMLElement;
                var el_id = elTile.getAttribute("data_space_id");
                if ( ! el_id || ! setOfSpaces[el_id]) continue;
                
                elTile.classList.add("board-space--available");

                elTile.onclick = () => {
                    clearAllAvailableSpaces();
                    for (let j = 0; j < elTiles.length; j++) {
                        (elTiles[j] as HTMLElement).onclick = null;
                    }
                    this.$data.spaceId = elTile.getAttribute("data_space_id");
                    elTile.classList.add("board-space--selected")
                    this.saveData();
                }
            }
        }
    },
    render: function (createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        if (this.showtitle) {
            children.push(createElement("div", {"class": "wf-select-space"}, $t(playerInput.title)));
        }
        if (this.$data.warning) {
            children.push(createElement("div", { domProps: { className: "nes-container is-rounded" } }, [createElement("span", { domProps: { className: "nes-text is-warning" } }, this.$data.warning)]));
        }

        return createElement("div", children);
    }
});

