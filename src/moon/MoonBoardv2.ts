import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {SerializedBoard} from '../boards/SerializedBoard';
import {Player} from '../Player';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceType} from '../SpaceType';
import {TileType} from '../TileType';
import {MoonSpaces} from './MoonSpaces';

export class MoonBoardv2 extends Board {
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

  public static newInstance(): MoonBoardv2 {
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    b.colony();

    const b = new Builder();
    b.row(2).land().land(STEEL, DRAW_CARD).land().mine(TITANIUM);
    b.row(1).mine(TITANIUM, TITANIUM).mine().land(STEEL).land().land();
    b.row(0).mine().land(STEEL).land(STEEL, TITANIUM).mine().mine(TITANIUM).land(STEEL, STEEL);
    b.row(1).land(STEEL).land().land().mine(TITANIUM).mine(TITANIUM);
    b.row(0).land().mine(TITANIUM).mine().land().mine().land(STEEL);
    b.row(1).land().land(STEEL).land(STEEL).land(DRAW_CARD, DRAW_CARD).land(STEEL);
    b.row(2).land(DRAW_CARD, DRAW_CARD).mine(TITANIUM).mine(TITANIUM, TITANIUM).land();

    b.colony();
    return new MoonBoardv2(b.spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): MoonBoardv2 {
    const spaces = Board.deserializeSpaces(board.spaces, players);
    return new MoonBoardv2(spaces);
  }
}

class Space implements ISpace {
  constructor(
    public id: string,
    public spaceType: SpaceType,
    public x: number,
    public y: number,
    public bonus: Array<SpaceBonus>) { }

  public static mine(id: string, x: number, y: number, bonus: Array<SpaceBonus>) {
    return new Space(id, SpaceType.LUNAR_MINE, x, y, bonus);
  }
  public static surface(id: string, x: number, y: number, bonus: Array<SpaceBonus>) {
    return new Space(id, SpaceType.LAND, x, y, bonus);
  }
  public static colony(id: string) {
    return new Space(id, SpaceType.COLONY, 0, 0, []);
  }
}

class Builder {
  y: number = -1;
  x: number = 0;
  spaces: Array<ISpace> = [];
  private idx: number = 0;

  public row(startX: number): Row {
    this.y++;
    this.x = startX;
    return new Row(this);
  }
  public colony() {
    this.spaces.push(Space.colony(this.nextId()));
  }
  public nextId(): string {
    let strId = this.idx.toString();
    if (this.idx < 10) {
      strId = '0'+strId;
    }
    this.idx++;
    return 'm' + strId;
  }
}

class Row {
  constructor(private builder: Builder) {
  }

  land(...bonuses: SpaceBonus[]): Row {
    const space = Space.surface(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }

  mine(...bonuses: SpaceBonus[]): Row {
    const space = Space.mine(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }
}
