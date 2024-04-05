import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board} from './Board';
import {IPlayer} from '../IPlayer';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {SpaceId} from '../../common/Types';
import {MarsBoard} from './MarsBoard';

export class UtopiaPlanitiaBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): UtopiaPlanitiaBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const ENERGY = SpaceBonus.ENERGY;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;

    // y=0
    builder.land().land().land(ENERGY, ENERGY).land().land();
    // y=1
    builder.land().land(STEEL, STEEL).land(ENERGY, ENERGY).land(ENERGY, ENERGY, DRAW_CARD).land().land();
    // y=2
    builder.ocean(PLANT, PLANT, PLANT).land().land(STEEL).land().land().land(DRAW_CARD, DRAW_CARD, TITANIUM).land(TITANIUM, TITANIUM);
    // y=3
    builder.ocean(PLANT, DRAW_CARD).land(PLANT).land(PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT).ocean(PLANT).land(PLANT);
    // y=4
    builder.land().land().land().land(PLANT).land(PLANT).land(PLANT, PLANT).land().ocean().land(PLANT, TITANIUM);
    // y=5
    builder.land(STEEL).land(STEEL, STEEL).ocean(PLANT, PLANT).land(PLANT, PLANT).land().land().land(STEEL, STEEL).land();
    // y=6
    builder.land(STEEL).land().ocean().ocean(PLANT, PLANT).land().land().land();
    // y=7
    builder.land().land(DRAW_CARD, DRAW_CARD).ocean().ocean(PLANT, PLANT).land(STEEL, TITANIUM).land(PLANT, PLANT);
    // y=8
    builder.land().land().land(STEEL, STEEL).ocean(PLANT).land(PLANT);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng, SpaceName.NOCTIS_CITY, SpaceName.THARSIS_THOLUS, SpaceName.ASCRAEUS_MONS, SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS);
    }
    const spaces = builder.build();
    return new UtopiaPlanitiaBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): UtopiaPlanitiaBoard {
    return new UtopiaPlanitiaBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public override getVolcanicSpaceIds(): ReadonlyArray<SpaceId> {
    return [];
  }
}
