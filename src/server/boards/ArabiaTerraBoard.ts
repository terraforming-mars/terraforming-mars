import {IPlayer} from '../IPlayer';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Space} from './Space';
import {MarsBoard} from './MarsBoard';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;
const MICROBE = SpaceBonus.MICROBE;
const DATA = SpaceBonus.DATA;
const ENERGY_PRODUCTION = SpaceBonus.ENERGY_PRODUCTION;
const SCIENCE = SpaceBonus.SCIENCE;

export class ArabiaTerraBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .ocean().ocean(PLANT).land().land().ocean(DRAW_CARD, DRAW_CARD)
    // y=1
    .ocean(MICROBE, MICROBE, DRAW_CARD).ocean(PLANT).land(PLANT, PLANT).land().land(PLANT).land(PLANT)
    // y=2
    .land(PLANT, STEEL).ocean(PLANT).land(DATA, DATA, DRAW_CARD).land(STEEL).land(STEEL).land(STEEL, PLANT).coveVolcanic(STEEL, TITANIUM)
    // y=3
    .land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT).land().land().land().land(STEEL, STEEL).land()
    // y=4
    .land().land().ocean(STEEL).cove(ENERGY_PRODUCTION).ocean(PLANT, PLANT).land(SCIENCE, DRAW_CARD, STEEL).land().land().land()
    // y=5
    .land(PLANT).land(PLANT).ocean(STEEL, STEEL).land(PLANT).land(STEEL).land().cove(PLANT, TITANIUM).land(PLANT)
    // y=6
    .cove(PLANT, TITANIUM).ocean(PLANT, PLANT).cove(PLANT, PLANT).land(PLANT).land(STEEL).land(PLANT, TITANIUM).land(TITANIUM, TITANIUM)
    // y=7
    .ocean(PLANT, PLANT).land(PLANT).volcanic(STEEL, DRAW_CARD).land(STEEL, STEEL).land(STEEL).volcanic(DRAW_CARD)
    // y=8
    .land().land().land().land().volcanic(STEEL)
    .build();

  public override getSpaces(spaceType: SpaceType): Array<Space> {
    switch (spaceType) {
    case SpaceType.LAND:
    case SpaceType.OCEAN:
      return this.spaces.filter((space) => space.spaceType === spaceType || space.spaceType === SpaceType.COVE);
    default:
      return this.spaces.filter((space) => space.spaceType === spaceType);
    }
  }

  public override getAvailableSpacesForOcean(player: IPlayer): readonly Space[] {
    // Nomads can be found on cove spaces
    return super.getAvailableSpacesForOcean(player)
      .filter((space) => space.id !== player.game.nomadSpace);
  }
}
