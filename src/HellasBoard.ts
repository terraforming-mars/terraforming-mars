import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { Board, Land, Ocean, Colony } from './Board';

export class HellasBoard extends Board{
    constructor() {
        super();
        this.spaces.push(new Colony(SpaceName.GANYMEDE_COLONY)); 
        this.spaces.push(new Colony(SpaceName.PHOBOS_SPACE_HAVEN));                    

        let idx = 3, pos_x = 4, pos_y=0;

        this.spaces.push(
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT])
        );

        pos_x = 3; pos_y=1;
        this.spaces.push(
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT])
        );

        pos_x = 2; pos_y=2;
        this.spaces.push(
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.DRAW_CARD])
        );

        pos_x = 1; pos_y=3;
        this.spaces.push(
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT])
        );

        pos_x = 0; pos_y=4;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.HEAT, SpaceBonus.HEAT, SpaceBonus.HEAT ]),
            new Ocean(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT])
        );

        pos_x = 1; pos_y=5;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Ocean(idx++, pos_x++, pos_y),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y,)
        );

        pos_x = 2; pos_y=6;
        this.spaces.push(
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM, SpaceBonus.TITANIUM]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM])
        );

        pos_x = 3; pos_y=7;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.HEAT, SpaceBonus.HEAT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.HEAT, SpaceBonus.HEAT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM])
        );

        pos_x = 4; pos_y=8;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.HEAT, SpaceBonus.HEAT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.OCEAN]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.HEAT, SpaceBonus.HEAT]),
            new Land(idx++, pos_x++, pos_y)
        );
    }    
}
