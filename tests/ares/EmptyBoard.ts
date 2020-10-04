import { Board } from "../../src/Board";
import { ISpace } from "../../src/ISpace";
import { Player } from "../../src/Player";
import { SpaceBonus } from "../../src/SpaceBonus";
import { SpaceName } from "../../src/SpaceName";

export class EmptyBoard extends Board {

    constructor() {
        super();

        const is_ocean: Array<boolean> = [];
        const bonus: Array<Array<SpaceBonus>> = [];
        for (var x = 0; x <  5 + 6 + 7 + 8 + 9 + 8 + 7 + 6 + 5; x ++) {
            is_ocean.push(false);
            bonus.push([]);
        }

        let pos_x = 4, pos_y = 0;
        let idx = 3, me_id = 0;

        pos_x = 4, pos_y = 0;
        for (let i = 0; i < 5; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 3; pos_y = 1;
        for (let i = 0; i < 6; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 2; pos_y = 2;
        for (let i = 0; i < 7; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 1; pos_y = 3;
        for (let i = 0; i < 8; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }


        pos_x = 0; pos_y = 4;
        for (let i = 0; i < 9; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 1; pos_y = 5;
        for (let i = 0; i < 8; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 2; pos_y = 6;
        for (let i = 0; i < 7; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 3; pos_y = 7;
        for (let i = 0; i < 6; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 4; pos_y = 8;
        for (let i = 0; i < 5; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }
    }
    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
        return super.getAvailableSpacesOnLand(player).filter((space) => space.id !== SpaceName.NOCTIS_CITY);
    }
    public getForestSpace(spaces: Array<ISpace>): ISpace {
        const space = super.shuffle(spaces).find((s) => this.canPlaceTile(s));
        if (space === undefined) {
            throw new Error("Did not find space for forest");
        }
        return space;
    }
}
