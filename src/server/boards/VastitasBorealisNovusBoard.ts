import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {Board} from './Board';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {SpaceId} from '../../common/Types';
import {MarsBoard} from './MarsBoard';
import {Turmoil} from '../turmoil/Turmoil';
import {SpaceName} from '../SpaceName';
import {Space} from './Space';

export class VastitasBorealisNovusBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): VastitasBorealisNovusBoard {
    const builder = new BoardBuilder(gameOptions.venusNextExtension, gameOptions.pathfindersExpansion);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const HEAT = SpaceBonus.HEAT;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TEMPERATURE = SpaceBonus.TEMPERATURE;
    const DELEGATE = SpaceBonus.DELEGATE;

    // y=0
    builder.land(PLANT).land().land(STEEL).land().land();
    // y=1
    builder.land(PLANT, PLANT).land(PLANT, PLANT).land().land().land(PLANT).land(DRAW_CARD);
    // y=2
    builder.land(DRAW_CARD).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT).land().land();
    // y=3
    builder.land(STEEL, STEEL).land(TITANIUM).ocean(PLANT, PLANT).land(PLANT).land().land(DRAW_CARD).land(PLANT).land(DELEGATE);
    // y=4
    builder.land().land().ocean(PLANT).land(PLANT, PLANT).land(TEMPERATURE).ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(DRAW_CARD, DRAW_CARD);
    // y=5
    builder.land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean(HEAT, HEAT).ocean(HEAT, HEAT, PLANT).ocean(DRAW_CARD).land(PLANT).land(TITANIUM, TITANIUM);
    // y=6
    builder.land(TITANIUM).land(STEEL).ocean().ocean(HEAT, HEAT).land(PLANT, PLANT).land(PLANT).land();
    // y=7
    builder.land(PLANT).land().land(PLANT).land(PLANT, STEEL).land(STEEL).land(PLANT);
    // y=8
    builder.land(DELEGATE).land().land(DRAW_CARD).land(STEEL).land(TITANIUM);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng);
    }
    const spaces = builder.build();
    return new VastitasBorealisNovusBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces);
  }

  public override getAvailableSpacesOnLand(player: IPlayer, canAffordOptions: CanAffordOptions) {
    return super.getAvailableSpacesOnLand(player, canAffordOptions).filter((space) => {
      if (space.bonus.includes(SpaceBonus.DELEGATE)) {
        return Turmoil.ifTurmoilElse(
          player.game,
          (turmoil) => turmoil.hasDelegatesInReserve(player),
          () => true);
      }
      return true;
    });
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): VastitasBorealisNovusBoard {
    return new VastitasBorealisNovusBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public override getVolcanicSpaceIds(): ReadonlyArray<SpaceId> {
    return [SpaceName.VASTITAS_BOREALIS_NOVUS_HECATES_THOLUS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_ELYSIUM_MONS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_ALBA_MONS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_URANIUS_THOULS,
    ];
  }
}
