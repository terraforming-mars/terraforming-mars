import {Board} from '../boards/Board';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {MoonSpaces} from '../../common/moon/MoonSpaces';
import {SpaceId, isSpaceId, safeCast} from '../../common/Types';

function mineSpace(id: SpaceId, x: number, y: number, bonus: Array<SpaceBonus>): Space {
  return {id, spaceType: SpaceType.LUNAR_MINE, x, y, bonus};
}
function surfaceSpace(id: SpaceId, x: number, y: number, bonus: Array<SpaceBonus>): Space {
  return {id, spaceType: SpaceType.LAND, x, y, bonus};
}
function colonySpace(id: SpaceId): Space {
  return {id, spaceType: SpaceType.COLONY, x: -1, y: -1, bonus: []};
}

export class MoonBoard extends Board {
  public getAvailableSpacesForMine(player: IPlayer): ReadonlyArray<Space> {
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

  public constructor(spaces: Array<Space>) {
    super(spaces, undefined, []);
  }
}

class Builder {
  y: number = -1;
  x: number = 0;
  spaces: Array<Space> = [];
  private idx: number = 0;

  public row(startX: number): Row {
    this.y++;
    this.x = startX;
    return new Row(this);
  }
  public colony() {
    this.spaces.push(colonySpace(this.nextId()));
  }
  public nextId(): SpaceId {
    this.idx++;
    const strId = this.idx.toString().padStart(2, '0');
    return safeCast('m' + strId, isSpaceId);
  }
}

class Row {
  constructor(private builder: Builder) {
  }

  land(...bonuses: SpaceBonus[]): this {
    const space = surfaceSpace(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }

  mine(...bonuses: SpaceBonus[]): this {
    const space = mineSpace(this.builder.nextId(), this.builder.x++, this.builder.y, bonuses);
    this.builder.spaces.push(space);
    return this;
  }
}
