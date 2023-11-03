import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board, SpaceCosts} from './Board';
import {IPlayer} from '../IPlayer';
import {Space} from './Space';
import {HELLAS_BONUS_OCEAN_COST} from '../../common/constants';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';

export class HellasBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): HellasBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const HEAT = SpaceBonus.HEAT;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TWO_PLANTS = [PLANT, PLANT];

    // y=0
    builder.ocean(...TWO_PLANTS).land(...TWO_PLANTS).land(...TWO_PLANTS).land(PLANT, STEEL).land(PLANT);
    // y=1
    builder.ocean(...TWO_PLANTS).land(...TWO_PLANTS).land(PLANT).land(PLANT, STEEL).land(PLANT).land(PLANT);
    // y=2
    builder.ocean(PLANT).land(PLANT).land(STEEL).land(STEEL).land().land(...TWO_PLANTS).land(PLANT, DRAW_CARD);
    // y=3
    builder.ocean(PLANT).land(PLANT).land(STEEL).land(STEEL, STEEL).land(STEEL).ocean(PLANT).ocean(PLANT).land(PLANT);
    // y=4
    builder.land(DRAW_CARD).land().land().land(STEEL, STEEL).land().ocean(DRAW_CARD).ocean(HEAT, HEAT, HEAT).ocean().land(PLANT);
    // y=5
    builder.land(TITANIUM).land().land(STEEL).land().land().ocean().ocean(STEEL).land();
    // y=6
    builder.ocean(TITANIUM, TITANIUM).land().land().land(DRAW_CARD).land().land().land(TITANIUM);
    // y=7
    builder.land(STEEL).land(DRAW_CARD).land(HEAT, HEAT).land(HEAT, HEAT).land(TITANIUM).land(TITANIUM);
    // y=8
    builder.land().land(HEAT, HEAT).land(SpaceBonus.OCEAN).doNotShuffleLastSpace().land(HEAT, HEAT).land();

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng);
    }

    const spaces = builder.build();
    return new HellasBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): HellasBoard {
    return new HellasBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public override spaceCosts(space: Space): SpaceCosts {
    const costs = super.spaceCosts(space);
    if (space.id === SpaceName.HELLAS_OCEAN_TILE) {
      costs.stock.megacredits = HELLAS_BONUS_OCEAN_COST;
      costs.tr.oceans = 1;
    }
    return costs;
  }
}
