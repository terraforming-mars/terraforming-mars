import {GameOptions} from '../game/GameOptions';
import {IPlayer} from '../IPlayer';
import {Random} from '../../common/utils/Random';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../../common/boards/SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {BoardBuilder} from './BoardBuilder';
import {Space} from './Space';
import {MarsBoard} from './MarsBoard';

export class ArabiaTerraBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): ArabiaTerraBoard {
    const builder = new BoardBuilder(gameOptions);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const MICROBE = SpaceBonus.MICROBE;
    const DATA = SpaceBonus.DATA;
    const ENERGY_PRODUCTION = SpaceBonus.ENERGY_PRODUCTION;
    const SCIENCE = SpaceBonus.SCIENCE;

    // y=0
    builder.ocean().ocean(PLANT).land().land().ocean(DRAW_CARD, DRAW_CARD);
    // y=1
    builder.ocean(MICROBE, MICROBE, DRAW_CARD).ocean(PLANT).land(PLANT, PLANT).land().land(PLANT).land(PLANT);
    // y=2
    builder.land(PLANT, STEEL).ocean(PLANT).land(DATA, DATA, DRAW_CARD).land(STEEL).land(STEEL).land(STEEL, PLANT).cove(STEEL, TITANIUM);
    // y=3
    builder.land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT).land().land().land().land(STEEL, STEEL).land();
    // y=4
    builder.land().land().ocean(STEEL).cove(ENERGY_PRODUCTION).ocean(PLANT, PLANT).land(SCIENCE, DRAW_CARD, STEEL).land().land().land();
    // y=5
    builder.land(PLANT).land(PLANT).ocean(STEEL, STEEL).land(PLANT).land(STEEL).land().cove(PLANT, TITANIUM).land(PLANT);
    // y=6
    builder.cove(PLANT, TITANIUM).ocean(PLANT, PLANT).cove(PLANT, PLANT).land(PLANT).land(STEEL).land(PLANT, TITANIUM).land(TITANIUM, TITANIUM);
    // y=7
    builder.ocean(PLANT, PLANT).land(PLANT).land(STEEL, DRAW_CARD).land(STEEL, STEEL).land(STEEL).land(DRAW_CARD);
    // y=8
    builder.land().land().land().land().land(STEEL);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng, SpaceName.TIKHONAROV, SpaceName.LADON, SpaceName.FLAUGERGUES, SpaceName.CHARYBDIS);
    }

    const spaces = builder.build();
    return new ArabiaTerraBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, [
      SpaceName.TIKHONAROV,
      SpaceName.LADON,
      SpaceName.FLAUGERGUES,
      SpaceName.CHARYBDIS,
    ]);
  }

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
