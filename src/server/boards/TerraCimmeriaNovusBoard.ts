import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {SpaceId} from '../../common/Types';
import {MarsBoard} from './MarsBoard';
import {Space} from './Space';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {TERRA_CIMMERIA_COLONY_COST} from '../../common/constants';

const VOLCANIC_SPACE_IDS: ReadonlyArray<SpaceId> = ['05', '21', '27', '38'];
const CURIOSITY_SPACE_ID: SpaceId = '16';
export class TerraCimmeriaNovusBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): TerraCimmeriaNovusBoard {
    const builder = new BoardBuilder(gameOptions);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const COLONY = SpaceBonus.COLONY;

    // y=0
    builder.ocean().land(PLANT).land(STEEL).land(PLANT).ocean(PLANT, PLANT);
    // y=1
    builder.ocean(TITANIUM, TITANIUM).land().land().land().land(PLANT, STEEL).ocean(PLANT);
    // y=2
    builder.land().land().land(COLONY).doNotShuffleLastSpace().land().land().land(PLANT).land();
    // y=3
    builder.land(STEEL).land().land(STEEL).land().land(STEEL, STEEL).land().land(TITANIUM, TITANIUM).land(DRAW_CARD);
    // y=4
    builder.land().land().land().land(STEEL).land(STEEL).land(DRAW_CARD).land().land(STEEL, DRAW_CARD).ocean();
    // y=5
    builder.land(DRAW_CARD, DRAW_CARD).land().land(TITANIUM, STEEL, STEEL).land().land(TITANIUM).land(STEEL, STEEL).land().land(STEEL, STEEL);
    // y=6
    builder.land(PLANT, PLANT).land(TITANIUM).land().land(PLANT, STEEL, STEEL).land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT);
    // y=7
    builder.ocean().land(PLANT).land(TITANIUM).land(DRAW_CARD).land(PLANT, PLANT).ocean(PLANT, PLANT);
    // y=8
    builder.ocean(PLANT, PLANT).ocean(PLANT).ocean(PLANT).land(PLANT).ocean(PLANT);

    if (gameOptions.shuffleMapOption) {
      builder.shuffle(rng);
    }
    const spaces = builder.build();

    // Remove colony bonuses when colonies is not in the game.
    if (gameOptions.coloniesExtension !== true) {
      spaces.forEach((space) => space.bonus = space.bonus.filter((bonus) => bonus !== COLONY));
    }
    return new TerraCimmeriaNovusBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, VOLCANIC_SPACE_IDS);
  }

  public override spaceCosts(space: Space) {
    const costs = super.spaceCosts(space);
    if (space.bonus.includes(SpaceBonus.COLONY)) {
      costs.megacredits = TERRA_CIMMERIA_COLONY_COST;
    }
    return costs;
  }

  public override getAvailableSpacesOnLand(player: IPlayer, canAffordOptions?: CanAffordOptions) {
    return super.getAvailableSpacesOnLand(player, canAffordOptions).filter((space) => {
      if (space.id === CURIOSITY_SPACE_ID) {
        if (player.colonies.getPlayableColonies().length === 0) {
          return false;
        }
      }
      return true;
    });
  }
}
