import {SpaceBonus} from '../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {Player} from '../Player';
import {ISpace} from './ISpace';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../Random';
import {GameOptions} from '../Game';

export class OriginalBoard extends Board {
  public static newInstance(gameOptions: GameOptions, rng: Random): OriginalBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TWO_PLANTS = [PLANT, PLANT];

    // y=0
    builder.land(STEEL, STEEL).ocean(STEEL, STEEL).land().ocean(DRAW_CARD).ocean();
    // y=1
    builder.land().land(STEEL).land().land().land().ocean(DRAW_CARD, DRAW_CARD);
    // y=2
    builder.land(DRAW_CARD).land().land().land().land().land().land(STEEL);
    // y=3
    builder.land(PLANT, TITANIUM).land(PLANT).land(PLANT).land(PLANT).land(...TWO_PLANTS).land(PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=4
    builder.land(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS).ocean(...TWO_PLANTS).ocean(...TWO_PLANTS)
      .ocean(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS);
    // y=5
    builder.land(PLANT).land(...TWO_PLANTS).land(PLANT).land(PLANT).land(PLANT).ocean(PLANT).ocean(PLANT).ocean(PLANT);
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
    return new OriginalBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): OriginalBoard {
    return new OriginalBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public override getNonReservedLandSpaces(): Array<ISpace> {
    return super.getNonReservedLandSpaces().filter((space) => space.id !== SpaceName.NOCTIS_CITY);
  }

  public override getAvailableSpacesOnLand(player: Player): Array<ISpace> {
    return super.getAvailableSpacesOnLand(player).filter((space) => space.id !== SpaceName.NOCTIS_CITY);
  }

  public override canPlaceTile(space: ISpace): boolean {
    return super.canPlaceTile(space) && space.id !== SpaceName.NOCTIS_CITY;
  }

  public getVolcanicSpaceIds(): Array<string> {
    return [
      SpaceName.ASCRAEUS_MONS,
      SpaceName.ARSIA_MONS,
      SpaceName.PAVONIS_MONS,
      SpaceName.THARSIS_THOLUS,
    ];
  }

  public getNoctisCitySpaceIds(): Array<string> {
    return [SpaceName.NOCTIS_CITY];
  }
}
