import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { Board, BoardColony } from "./Board";

export class ElysiumBoard extends Board {
    constructor(shuffleMapOption: boolean = false, seed: number = 0) {
        super();
        this.seed = Math.floor(seed * 4294967296)
        this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY));
        this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));

        const is_ocean: Array<boolean> = [];
        const bonus: Array<Array<SpaceBonus>> = [];
        // y=0
        is_ocean.push(true, true, true, true, false);
        bonus.push([],
            [SpaceBonus.TITANIUM],
            [SpaceBonus.DRAW_CARD],
            [SpaceBonus.STEEL],
            [SpaceBonus.DRAW_CARD]);
        // y=1
        is_ocean.push(false, false, false, true, true, false);
        bonus.push([SpaceBonus.TITANIUM], [], [], [], [], [SpaceBonus.STEEL, SpaceBonus.STEEL]);

        // y=2
        is_ocean.push(false, false, false, false, true, true, false);
        bonus.push([SpaceBonus.TITANIUM, SpaceBonus.TITANIUM],
            [],
            [SpaceBonus.DRAW_CARD],
            [],
            [SpaceBonus.PLANT],
            [],
            [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD]);

        // y=3
        is_ocean.push(false, false, false, true, false, true, true, false);
        bonus.push(
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT,],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.STEEL],
        );
        // y=4
        is_ocean.push(false, false, false, true, false, false, false, false, false);
        bonus.push(
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.TITANIUM],
        );
        // y=5
        is_ocean.push(false, false, false, false, false, false, false, false);
        bonus.push(
            [SpaceBonus.STEEL],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [],
        );
        //y=6
        is_ocean.push(false, false, false, false, false, false, false);
        bonus.push([SpaceBonus.TITANIUM], [SpaceBonus.STEEL], [], [], [SpaceBonus.STEEL], [], []);
        //y=7
        is_ocean.push(false, false, false, false, false, false);
        bonus.push([SpaceBonus.STEEL, SpaceBonus.STEEL], [], [], [], [SpaceBonus.STEEL, SpaceBonus.STEEL], []);
        // y=8
        is_ocean.push(false, false, false, false, false);
        bonus.push([SpaceBonus.STEEL], [], [SpaceBonus.DRAW_CARD], [SpaceBonus.DRAW_CARD], [SpaceBonus.STEEL, SpaceBonus.STEEL]);
        
        if (shuffleMapOption) {
            this.shuffleMap(is_ocean, bonus, [SpaceName.HECATES_THOLUS, SpaceName.ELYSIUM_MONS, SpaceName.ARSIA_MONS_ELYSIUM, SpaceName.OLYMPUS_MONS]);
        }

        let idx = 3, me_id = 0;
        let pos_x = 4, pos_y = 0;
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
}
