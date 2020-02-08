import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { Board, Land, Ocean, BoardColony, Space } from './Board';
import { Player } from './Player';
import { ISpace } from './ISpace';

export class OriginalBoard extends Board{
    constructor() {
        super();
        this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY)); 
        this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));                    

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
