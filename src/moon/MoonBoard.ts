import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {SerializedBoard} from '../boards/SerializedBoard';
import {Player} from '../Player';
import {SpaceBonus} from '../common/boards/SpaceBonus';
import {SpaceType} from '../common/boards/SpaceType';
import {MoonSpaces} from './MoonSpaces';

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
    return new Space(id, SpaceType.COLONY, -1, -1, []);
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

  public static newInstance(): MoonBoard {
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    const b = new Builder();
    b.colony(); // Luna Trade Station
    b.row(2).land().land(STEEL, DRAW_CARD).land().mine(TITANIUM);
    b.row(1).mine(TITANIUM, TITANIUM).mine(/* Mare Imbrium */).land(STEEL).land().land();
    b.row(0).mine().land(STEEL).land(STEEL, TITANIUM).mine(/* Mare Serenatis*/).mine(TITANIUM).land(STEEL, STEEL);
    b.row(0).land(STEEL).land().land().mine(TITANIUM).mine(TITANIUM);
    b.row(0).land().mine(TITANIUM).mine(/* Mare Nubium */).land().mine(/* Mare Nectaris */).land(STEEL);
    b.row(1).land().land(STEEL).land(STEEL).land(DRAW_CARD, DRAW_CARD).land(STEEL);
    b.row(2).land(DRAW_CARD, DRAW_CARD).mine(TITANIUM).mine(TITANIUM, TITANIUM).land();
    b.colony();
    return new MoonBoard(b.spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): MoonBoard {
    const spaces = Board.deserializeSpaces(board.spaces, players);
    return new MoonBoard(spaces);
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
    this.idx++;
    const strId = this.idx.toString().padStart(2, '0');
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
