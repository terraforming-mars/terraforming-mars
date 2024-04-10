import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {MarsBoard} from './MarsBoard';
import {Turmoil} from '../turmoil/Turmoil';
import {SurfaceBuilder} from './SurfaceBuilder';

const PLANT = SpaceBonus.PLANT;
const STEEL = SpaceBonus.STEEL;
const HEAT = SpaceBonus.HEAT;
const DRAW_CARD = SpaceBonus.DRAW_CARD;
const TITANIUM = SpaceBonus.TITANIUM;
const TEMPERATURE = SpaceBonus.TEMPERATURE;
const DELEGATE = SpaceBonus.DELEGATE;

export class VastitasBorealisNovusBoard extends MarsBoard {
  public static readonly TEMPLATE = new SurfaceBuilder()
    // y=0
    .land(PLANT).land().volcanic(STEEL).land().land()
    // y=1
    .land(PLANT, PLANT).land(PLANT, PLANT).land().land().land(PLANT).volcanic(DRAW_CARD)
    // y=2
    .land(DRAW_CARD).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT).land().land()
    // y=3
    .volcanic(STEEL, STEEL).land(TITANIUM).ocean(PLANT, PLANT).land(PLANT).land().land(DRAW_CARD).land(PLANT).land(DELEGATE).doNotShuffleLastSpace()
    // y=4
    .land().land().ocean(PLANT).land(PLANT, PLANT).land(TEMPERATURE).doNotShuffleLastSpace().ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(DRAW_CARD, DRAW_CARD)
    // y=5
    .land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean(HEAT, HEAT).ocean(HEAT, HEAT, PLANT).ocean(DRAW_CARD).land(PLANT).land(TITANIUM, TITANIUM)
    // y=6
    .volcanic(TITANIUM).land(STEEL).ocean().ocean(HEAT, HEAT).land(PLANT, PLANT).land(PLANT).land()
    // y=7
    .land(PLANT).land().land(PLANT).land(PLANT, STEEL).land(STEEL).land(PLANT)
    // y=8
    .land(DELEGATE).doNotShuffleLastSpace().land().land(DRAW_CARD).land(STEEL).land(TITANIUM);

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
}
