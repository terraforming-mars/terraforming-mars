import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {SerializedBoard} from '../boards/SerializedBoard';
import {Player} from '../Player';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';
import {TileType} from '../TileType';
import {MoonSpaces} from './MoonSpaces';

class Space implements ISpace {
  public readonly bonus: Array<SpaceBonus> = [];
  constructor(public id: string, public spaceType: SpaceType, public x: number, public y: number) { }

  public static mine(id: string, x: number, y: number) {
    return new Space(id, SpaceType.LUNAR_MINE, x, y);
  }
  public static surface(id: string, x: number, y: number) {
    return new Space(id, SpaceType.LAND, x, y);
  }
  public static colony(id: string) {
    return new Space(id, SpaceType.COLONY, 0, 0);
  }
}

export class MoonBoard extends Board {
  public getNoctisCitySpaceIds() {
    return [];
  }
  public getVolcanicSpaceIds() {
    return [];
  }

  public getAvailableSpacesForMine(player: Player): Array<ISpace> {
    const spaces = this.spaces.filter((space) => {
      const val = space.tile === undefined &&
        space.spaceType === SpaceType.LUNAR_MINE &&
        space.id !== MoonSpaces.MARE_IMBRIUM &&
        space.id !== MoonSpaces.MARE_SERENITATIS &&
        space.id !== MoonSpaces.MARE_NUBIUM &&
        space.id !== MoonSpaces.MARE_NECTARIS &&
        (space.player === undefined || space.player.id === player.id);
      return val;
    });
    return spaces;
  }

  public getSpacesWithTile(tileType: TileType): Array<ISpace> {
    return this.spaces.filter((space) => space.tile?.tileType === tileType);
  }

  public static newInstance(): MoonBoard {
    const spaces: Array<ISpace> = [];

    spaces.push(Space.colony(MoonSpaces.LUNA_TRADE_STATION));
    // y = 0
    spaces.push(Space.mine('m02', 2, 0));
    spaces.push(Space.surface('m03', 3, 0));
    spaces.push(Space.surface('m04', 4, 0));

    // y = 1
    spaces.push(Space.surface('m05', 1, 1));
    spaces.push(Space.surface('m06', 2, 1));
    spaces.push(Space.mine('m07', 3, 1));
    spaces.push(Space.mine('m08', 4, 1));

    // y = 2
    spaces.push(Space.surface('m09', 0, 2));
    spaces.push(Space.surface('m10', 1, 2));
    spaces.push(Space.surface('m11', 2, 2));
    spaces.push(Space.mine('m12', 3, 2));
    spaces.push(Space.mine('m13', 4, 2));

    // y = 3
    spaces.push(Space.mine('m14', 1, 3));
    spaces.push(Space.mine('m15', 2, 3));
    spaces.push(Space.surface('m16', 3, 3));
    spaces.push(Space.mine('m17', 4, 3));
    // y = 4
    spaces.push(Space.surface('m18', 2, 4));
    spaces.push(Space.surface('m19', 3, 4));
    spaces.push(Space.surface('m20', 4, 4));

    spaces.push(Space.colony(MoonSpaces.MOMENTUM_VIRIUM));
    return new MoonBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): MoonBoard {
    const spaces = Board.deserializeSpaces(board.spaces, players);
    return new MoonBoard(spaces);
  }
}
