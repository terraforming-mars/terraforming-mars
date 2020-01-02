
import { ISpace } from "./ISpace";
import { SpaceType } from "./SpaceType";
import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";

class Space implements ISpace {
    constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {

    }
}

class Colony extends Space {
    constructor(id: string, bonus: Array<SpaceBonus> = []) {
        super(id, SpaceType.COLONY, bonus, -1, -1);
    }
}

class Land extends Space {
    constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
        let str_id = id.toString()
        if (id < 10) {
            str_id = "0"+str_id;
        }
        super(str_id, SpaceType.LAND, bonus, x, y);
    }
}

class Ocean extends Space {
    constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
        let str_id = id.toString()
        if (id < 10) {
            str_id = "0"+str_id;
        }
        super(str_id, SpaceType.OCEAN, bonus, x, y);
    }
}

export class OriginalBoard {
    public spaces: Array<ISpace> = [];
    constructor() {
        this.spaces.push(new Colony(SpaceName.GANYMEDE_COLONY)); 
        this.spaces.push(new Colony(SpaceName.PHOBOS_SPACE_HAVEN));

        let idx = 3, pos_x = 4, pos_y=0;

        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y,),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Ocean(idx++,  pos_x++, pos_y,)
        );

        pos_x = 3; pos_y=1;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y,),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD])
        );

        pos_x = 2; pos_y=2;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL])
        );

        pos_x = 1; pos_y=3;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.TITANIUM]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT])
        );

        pos_x = 0; pos_y=4;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT])
        );

        pos_x = 1; pos_y=5;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.PLANT])
        );

        pos_x = 2; pos_y=6;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.PLANT]),
            new Land(idx++, pos_x++, pos_y)
        );

        pos_x = 3; pos_y=7;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.DRAW_CARD]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM])
        );

        pos_x = 4; pos_y=8;
        this.spaces.push(
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(idx++, pos_x++, pos_y),
            new Land(idx++, pos_x++, pos_y),
            new Ocean(idx++, pos_x++, pos_y, [SpaceBonus.TITANIUM, SpaceBonus.TITANIUM])
        );
    }

    private getRandomSpace(offset: number = 0): ISpace {
        return this.spaces[Math.floor(Math.random() * 30) + offset];
    }

    private shuffle(input: Array<ISpace>): Array<ISpace> {
        const out: Array<ISpace> = input;
        const copy = input.slice();
        while (copy.length) {
            out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return out;
    }

    public getRandomCitySpace(offset: number = 0): Space {
        while (true) {
            let space = this.getRandomSpace(offset);
            if (space.tile === undefined 
                && space instanceof Land 
                && space.id !==  SpaceName.NOCTIS_CITY
                && space.spaceType !== SpaceType.COLONY ) {
                return space;
            }
        }
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
        spaces = this.shuffle(spaces);
        while (true) {
            const space =  spaces.pop();
            if (space !== undefined && space.tile === undefined && space instanceof Land && space.id !==  SpaceName.NOCTIS_CITY ) {
                return space;
            }
        }
    }
}
