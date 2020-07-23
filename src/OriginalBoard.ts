import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { Board, Land, BoardColony, Space } from "./Board";
import { Player } from "./Player";
import { ISpace } from "./ISpace";

export class OriginalBoard extends Board {

    constructor(shuffleMapOption: boolean = false, seed: number = 0) {
        super();
        this.seed = Math.floor(seed * 4294967296)
        this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY));
        this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));

        let is_ocean = [];
        let bonus = [];
        // y=0
        is_ocean.push(false, true, false, true, true);
        bonus.push([SpaceBonus.STEEL, SpaceBonus.STEEL], [SpaceBonus.STEEL, SpaceBonus.STEEL], [], [SpaceBonus.DRAW_CARD], []);
        // y=1
        is_ocean.push(false, false, false, false, false, true);
        bonus.push([], [SpaceBonus.STEEL], [], [], [], [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD]);

        // y=2
        is_ocean.push(false, false, false, false, false, false, false);
        bonus.push([SpaceBonus.DRAW_CARD], [], [], [], [], [], [SpaceBonus.STEEL]);

        // y=3
        is_ocean.push(false, false, false, false, false, false, false, true);
        bonus.push(
            [SpaceBonus.PLANT, SpaceBonus.TITANIUM],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
        );
        // y=4
        is_ocean.push(false, false, false, true, true, true, false, false, false);
        bonus.push(
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
        );
        // y=5
        is_ocean.push(false, false, false, false, false, true, true, true);
        bonus.push(
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
        );
        //y=6
        is_ocean.push(false, false, false, false, false, false, false);
        bonus.push([], [], [], [], [], [SpaceBonus.PLANT], []);
        //y=7
        is_ocean.push(false, false, false, false, false, false);
        bonus.push([SpaceBonus.STEEL, SpaceBonus.STEEL], [], [SpaceBonus.DRAW_CARD], [SpaceBonus.DRAW_CARD], [], [SpaceBonus.TITANIUM]);
        // y=8
        is_ocean.push(false, false, false, false, true);
        bonus.push([SpaceBonus.STEEL], [SpaceBonus.STEEL, SpaceBonus.STEEL], [], [], [SpaceBonus.TITANIUM, SpaceBonus.TITANIUM]);

        if (shuffleMapOption) {
            this.shuffleArray(is_ocean);
            this.shuffleArray(bonus);
            while (true) {
                let satisfy = true;
                let land_list = [SpaceName.NOCTIS_CITY, SpaceName.THARSIS_THOLUS, SpaceName.ASCRAEUS_MONS, SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS];
                for (let land of land_list) {
                    let land_id = Number(land) - 3;
                    while (is_ocean[land_id]) {
                        satisfy = false;
                        let idx = Math.floor(this.mulberry32() * (land_list.length + 1));
                        [is_ocean[land_id], is_ocean[idx]] = [is_ocean[idx], is_ocean[land_id]];
                    }
                }
                if (satisfy) break;
            }
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

        this.spaces.push(new BoardColony(SpaceName.STANFORD_TORUS));
    }
    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
        return super.getAvailableSpacesOnLand(player).filter((space) => space.id !== SpaceName.NOCTIS_CITY);
    }
    public getRandomCitySpace(offset: number): Space {
        while (true) {
            let space = super.getRandomSpace(offset);
            if (this.canPlaceTile(space) && this.getAdjacentSpaces(space).find(sp => this.canPlaceTile(sp)) !== undefined) {
                return space;
            }
        }
    }

    protected canPlaceTile(space: ISpace): boolean {
        return space !== undefined && space.tile === undefined && space instanceof Land && space.id !== SpaceName.NOCTIS_CITY;
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
        const space = super.shuffle(spaces).find((s) => this.canPlaceTile(s));
        if (space === undefined) {
            throw new Error("Did not find space for forest");
        }
        return space;
    }
}
