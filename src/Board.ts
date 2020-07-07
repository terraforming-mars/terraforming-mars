import { ISpace } from "./ISpace";
import { Player } from "./Player";
import { SpaceType } from "./SpaceType";
import { SpaceBonus } from "./SpaceBonus";
import { TileType } from "./TileType";

export abstract class Space implements ISpace {
    constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {

    }
}

export class BoardColony extends Space {
    constructor(id: string) {
        super(id, SpaceType.COLONY, [], -1, -1);
    }
}

export class Land extends Space {
    constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
        let str_id = id.toString()
        if (id < 10) {
            str_id = "0"+str_id;
        }
        super(str_id, SpaceType.LAND, bonus, x, y);
    }
}

export class Ocean extends Space {
    constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
        let str_id = id.toString()
        if (id < 10) {
            str_id = "0"+str_id;
        }
        super(str_id, SpaceType.OCEAN, bonus, x, y);
    }
}

export abstract class Board {
    public spaces: Array<ISpace> = [];
    public getAdjacentSpaces(space: ISpace): Array<ISpace> {
        if (space.spaceType !== SpaceType.COLONY) {
        if (space.y < 0 || space.y > 8) {
            throw new Error("Unexpected space y value");
        }
        if (space.x < 0 || space.x > 8) {
            throw new Error("Unexpected space x value");
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

    public getOceansTiles(): Array<ISpace> {
        return this.spaces.filter((space) => space.tile !== undefined &&
                    space.tile.tileType === TileType.OCEAN
        );
    }    

    public getSpaces(spaceType: SpaceType): Array<ISpace> {
        return this.spaces.filter((space) => space.spaceType === spaceType);
    }
    protected getRandomSpace(offset: number): ISpace {
        return this.spaces[Math.floor(Math.random() * 30) + offset];
    }

    public getEmptySpaces(): Array<ISpace> {
        return this.spaces.filter((space) => space.tile === undefined);
    }

    public getAvailableSpacesForCity(player: Player): Array<ISpace> {
        // A city cannot be adjacent to another city
        return this.getAvailableSpacesOnLand(player).filter(
        (space) => this.getAdjacentSpaces(space).filter((adjacentSpace) => Board.isCitySpace(adjacentSpace)).length === 0
        );
    } 

    public getAvailableSpacesForMarker(player: Player): Array<ISpace> {
        let spaces =  this.getAvailableSpacesOnLand(player)
        .filter(
            (space) => this.getAdjacentSpaces(space).find(
                (adj) => adj.player === player
            ) !== undefined
        );
        //Remove duplicates
        return spaces.filter((space,index) => spaces.indexOf(space) === index);
    }  

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
        const spacesForGreenery = this.getAvailableSpacesOnLand(player)
            .filter((space) => this.getAdjacentSpaces(space).find((adj) => adj.tile !== undefined && adj.player === player && adj.tile.tileType !== TileType.OCEAN) !== undefined);

        // Spaces next to tiles you own
        if (spacesForGreenery.length > 0) {
            return spacesForGreenery;
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
                (space) => space.tile === undefined &&
                        (space.player === undefined || space.player === player)
            );
    }

    protected shuffle(input: Array<ISpace>): Array<ISpace> {
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

    protected canPlaceTile(space: ISpace): boolean {
        return space !== undefined && space.tile === undefined && space instanceof Land;
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
        const space = this.shuffle(spaces).find((s) => this.canPlaceTile(s));
        if (space === undefined) {
            throw new Error("Did not find space for forest");
        }
        return space;
    }

    public static isCitySpace(space: ISpace): boolean {
        const cityTileTypes = [TileType.CITY, TileType.CAPITAL];
        return space.tile !== undefined && cityTileTypes.includes(space.tile.tileType);
    }
}  
