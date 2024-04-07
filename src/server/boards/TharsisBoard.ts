import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Space} from './Space';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {SpaceId} from '../../common/Types';
import {MarsBoard} from './MarsBoard';

export class TharsisBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): TharsisBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    // y=0
    builder.land(STEEL, STEEL).ocean(STEEL, STEEL).land().ocean(DRAW_CARD).ocean();
    // y=1
    builder.land().land(STEEL).land().land().land().ocean(DRAW_CARD, DRAW_CARD);
    // y=2
    builder.land(DRAW_CARD).land().land().land().land().land().land(STEEL);
    // y=3
    builder.land(PLANT, TITANIUM).land(PLANT).land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=4
    builder.land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT)
      .ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT).land(PLANT, PLANT);
    // y=5
    builder.land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).ocean(PLANT);
    // y=6
    builder.land().land().land().land().land().land(PLANT).land();
    // y=7
    builder.land(STEEL, STEEL).land().land(DRAW_CARD).land(DRAW_CARD).land().land(TITANIUM);
    // y=8
    builder.land(STEEL).land(STEEL, STEEL).land().land().ocean(TITANIUM, TITANIUM);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng, SpaceName.NOCTIS_CITY, SpaceName.THARSIS_THOLUS, SpaceName.ASCRAEUS_MONS, SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS);
    }
    const spaces = builder.build();
    return new TharsisBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): TharsisBoard {
    return new TharsisBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public override getNonReservedLandSpaces(): ReadonlyArray<Space> {
    return super.getNonReservedLandSpaces().filter((space) => space.id !== SpaceName.NOCTIS_CITY);
  }

  public override getAvailableSpacesOnLand(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return super.getAvailableSpacesOnLand(player, canAffordOptions).filter((space) => space.id !== SpaceName.NOCTIS_CITY);
  }

  public override canPlaceTile(space: Space): boolean {
    return super.canPlaceTile(space) && space.id !== SpaceName.NOCTIS_CITY;
  }

  public override getVolcanicSpaceIds(): ReadonlyArray<SpaceId> {
    return [
      SpaceName.ASCRAEUS_MONS,
      SpaceName.ARSIA_MONS,
      SpaceName.PAVONIS_MONS,
      SpaceName.THARSIS_THOLUS,
    ];
  }

  public override getNoctisCitySpaceId() {
    return SpaceName.NOCTIS_CITY;
  }
}
