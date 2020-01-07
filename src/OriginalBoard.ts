
import { ISpace } from "./ISpace";
import { Player } from "./Player";
import { SpaceType } from "./SpaceType";
import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { TileType } from "./TileType";

class Space implements ISpace {
    constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {

    }
}

class Colony extends Space {
    constructor(id: string) {
        super(id, SpaceType.COLONY, [], -1, -1);
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

    public getAdjacentSpaces(space: ISpace): Array<ISpace> {
      if (space.spaceType !== SpaceType.COLONY) {
        if (space.y < 0 || space.y > 8) {
          throw new Error('Unexpected space y value');
        }
        if (space.x < 0 || space.x > 8) {
          throw new Error('Unexpected space x value');
        }
        const leftSpace: Array<number> = [space.x - 1, space.y];
        const rightSpace: Array<number> = [space.x + 1, space.y];
        const topLeftSpace: Array<number> = [space.x, space.y - 1];
        const topRightSpace: Array<number> = [space.x, space.y - 1];
        const bottomLeftSpace: Array<number> = [space.x, space.y + 1];
        const bottomRightSpace: Array<number> = [space.x, space.y + 1];
        if (space.y < 4) {
          bottomLeftSpace[0]--;
          topRightSpace[0]++;
        } else if (space.y === 4) {
          bottomRightSpace[0]++;
          topRightSpace[0]++;
        } else {
          bottomRightSpace[0]++;
          topLeftSpace[0]--;
        }
        return this.spaces.filter((adj) => {
          return space !== adj && adj.spaceType !== SpaceType.COLONY && (
            (adj.x === leftSpace[0] && adj.y === leftSpace[1]) ||
            (adj.x === rightSpace[0] && adj.y === rightSpace[1]) ||
            (adj.x === topLeftSpace[0] && adj.y === topLeftSpace[1]) ||
            (adj.x === topRightSpace[0] && adj.y === topRightSpace[1]) ||
            (adj.x === bottomLeftSpace[0] && adj.y === bottomLeftSpace[1]) ||
            (adj.x === bottomRightSpace[0] && adj.y === bottomRightSpace[1])
          );
        });
      }
      return [];
    }

    public getSpaceByTileCard(cardName: string): ISpace | undefined {
      return this.spaces.find(
          (space) => space.tile !== undefined && space.tile.card === cardName
      );
    }

    public getOceansOnBoard(): number {
      return this.spaces.filter((space) => space.tile !== undefined &&
                   space.tile.tileType === TileType.OCEAN
      ).length;
    }

    public getSpaces(spaceType: SpaceType): Array<ISpace> {
      return this.spaces.filter((space) => space.spaceType === spaceType);
    }
    private getRandomSpace(offset: number): ISpace {
        return this.spaces[Math.floor(Math.random() * 30) + offset];
    }

    public getAvailableSpacesForCity(player: Player): Array<ISpace> {
      // A city cannot be adjacent to another city
      return this.getAvailableSpacesOnLand(player).filter(
        (space) => this.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType === TileType.CITY).length === 0
      );
    } 

    private playerHasSpace(player: Player): boolean {
      return this.spaces.find(
          (space) => space.tile !== undefined &&
                   space.player === player &&
                   space.spaceType !== SpaceType.COLONY &&
                   space.tile.tileType !== TileType.OCEAN
      ) !== undefined;
    }

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
      // Greenery must be placed by a space you own if you own a space
      if (this.playerHasSpace(player)) {
        return this.getAvailableSpacesOnLand(player)
            .filter(
                (space) => this.getAdjacentSpaces(space).find(
                    (adj) => adj.tile !== undefined &&
                                 adj.tile.tileType !== TileType.OCEAN &&
                                 adj.player === player
                ) !== undefined
            );
      }
      // Place anywhere if no space owned
      return this.getAvailableSpacesOnLand(player);
    }

    public getAvailableSpacesForOcean(player: Player): Array<ISpace> {
      return this.getSpaces(SpaceType.OCEAN)
          .filter(
              (space) => space.tile === undefined &&
                       (space.player === undefined || space.player === player)
          );
    }

    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
      return this.getSpaces(SpaceType.LAND)
          .filter(
              (space) => space.id !== SpaceName.NOCTIS_CITY &&
                       space.tile === undefined &&
                       (space.player === undefined || space.player === player)
          );
    }

    private shuffle(input: Array<ISpace>): Array<ISpace> {
        const out: Array<ISpace> = [];
        const copy = input.slice();
        while (copy.length) {
            out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return out;
    }

    public getRandomCitySpace(offset: number): Space {
        while (true) {
            let space = this.getRandomSpace(offset);
            if (this.canPlaceTile(space) && this.getAdjacentSpaces(space).find(sp => this.canPlaceTile(sp)) !== undefined) {
                return space;
            }
        }
    }

    private canPlaceTile(space: ISpace): boolean {
        return space !== undefined && space.tile === undefined && space instanceof Land && space.id !== SpaceName.NOCTIS_CITY;
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
        const space = this.shuffle(spaces).find((s) => this.canPlaceTile(s));
        if (space === undefined) {
            throw new Error("Did not find space for forest");
        }
        return space;
    }
}
