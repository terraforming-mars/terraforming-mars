import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';
import {Turmoil} from '../turmoil/Turmoil';
import {SpaceName} from '../../common/boards/SpaceName';
import {Space} from './Space';
import {VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST} from '../../common/constants';
import {SpaceCosts} from './Board';

export class VastitasBorealisNovusBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): VastitasBorealisNovusBoard {
    const builder = new BoardBuilder(gameOptions);

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
      builder.shuffle(rng,
        SpaceName.VASTITAS_BOREALIS_NOVUS_HECATES_THOLUS,
        SpaceName.VASTITAS_BOREALIS_NOVUS_ELYSIUM_MONS,
        SpaceName.VASTITAS_BOREALIS_NOVUS_ALBA_MONS,
        SpaceName.VASTITAS_BOREALIS_NOVUS_URANIUS_THOULS,
      );
    }
    const spaces = builder.build();
    return new VastitasBorealisNovusBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, [SpaceName.VASTITAS_BOREALIS_NOVUS_HECATES_THOLUS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_ELYSIUM_MONS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_ALBA_MONS,
      SpaceName.VASTITAS_BOREALIS_NOVUS_URANIUS_THOULS,
    ]);
  }

  public override getAvailableSpacesOnLand(player: IPlayer, canAffordOptions?: CanAffordOptions) {
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

  public override spaceCosts(space: Space): SpaceCosts {
    const costs = super.spaceCosts(space);
    if (space.bonus.includes(SpaceBonus.TEMPERATURE)) {
      costs.megacredits = VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST;
      costs.tr.temperature = 1;
    }
    return costs;
  }
}
