
import { ISpace } from "./ISpace";
import { SpaceType } from "./SpaceType";
import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";

class Space implements ISpace {
    constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number) {

    }
}

class Colony extends Space {
    constructor(public id: string, bonus: Array<SpaceBonus> = []) {
        super(id, SpaceType.COLONY, bonus, -1, -1);
    }
}

class Land extends Space {
    constructor(x: number, y: number, bonus: Array<SpaceBonus> = [], id?: string) {
        if (id === undefined) {
            id = x + ":" + y;
        }
        super(id, SpaceType.LAND, bonus, x, y);
    }
}

class Ocean extends Space {
    constructor(x: number, y: number, bonus: Array<SpaceBonus> = []) {
        super(x + ":" + y, SpaceType.OCEAN, bonus, x, y);
    }
}

export class OriginalBoard {
    public spaces: Array<ISpace> = [];
    constructor() {
        this.spaces.push(new Colony(SpaceName.GANYMEDE_COLONY)); 
        this.spaces.push(new Colony(SpaceName.PHOBOS_SPACE_HAVEN));
        let rowCount = 0, colCount = 4;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Ocean(colCount++, rowCount, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(colCount++, rowCount),
            new Ocean(colCount++, rowCount, [SpaceBonus.DRAW_CARD]),
            new Ocean(colCount++, rowCount)
        );
        rowCount = 1; colCount = 3;
        this.spaces.push(
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount, [SpaceBonus.STEEL], SpaceName.THARSIS_THOLUS),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Ocean(colCount++, rowCount, [SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD])
        );
        rowCount = 2; colCount = 2;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.DRAW_CARD], SpaceName.ASCRAEUS_MONS),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount, [SpaceBonus.STEEL])
        );
        rowCount = 3; colCount = 1;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.TITANIUM], SpaceName.PAVONIS_MONS),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT])
        );
        rowCount = 4; colCount = 0;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT], SpaceName.ARSIA_MONS),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT], SpaceName.NOCTIS_CITY),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT])
        );
        rowCount = 5; colCount = 1;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT, SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Ocean(colCount++, rowCount, [SpaceBonus.PLANT])
        );
        rowCount = 6; colCount = 2;
        this.spaces.push(
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount, [SpaceBonus.PLANT]),
            new Land(colCount++, rowCount)
        );
        rowCount = 7; colCount = 3;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount, [SpaceBonus.DRAW_CARD]),
            new Land(colCount++, rowCount, [SpaceBonus.DRAW_CARD]),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount, [SpaceBonus.TITANIUM])
        );
        rowCount = 8; colCount = 4;
        this.spaces.push(
            new Land(colCount++, rowCount, [SpaceBonus.STEEL]),
            new Land(colCount++, rowCount, [SpaceBonus.STEEL, SpaceBonus.STEEL]),
            new Land(colCount++, rowCount),
            new Land(colCount++, rowCount),
            new Ocean(colCount++, rowCount, [SpaceBonus.TITANIUM, SpaceBonus.TITANIUM])
        );
    }

    private getRandomSpace(offset: number = 0): Space {
        return this.spaces[Math.floor(Math.random() * 30) + offset];
    }

    private shuffle(input: Array<ISpace>): Array<ISpace> {
        const out: Array<ISpace> = [];
        const copy = input.slice();
        while (copy.length) {
            out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return out;
    }

    public getRandomCitySpace(offset: number = 0): Space {
        while (true) {
            let space = this.getRandomSpace(offset);
            if (space instanceof Land && space.id !==  SpaceName.NOCTIS_CITY ) {
                return space;
            }
        }
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
        spaces = this.shuffle(spaces);
        while (true) {
            const space: ISpace | undefined = spaces.pop();
            if (space instanceof Land && space.id !==  SpaceName.NOCTIS_CITY ) {
                return space;
            }
        }
    }
}
