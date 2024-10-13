import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Board} from '../../boards/Board';
import {Space} from '../../boards/Space';
import {GainResources} from '../../deferredActions/GainResources';
import {Resource} from '../../../common/Resource';
import {SpaceType} from '../../../common/boards/SpaceType';
import {BoardType} from '../../boards/BoardType';
import {Phase} from '../../../common/Phase';

export class Gordon extends CeoCard {
  constructor() {
    super({
      name: CardName.GORDON,
      metadata: {
        cardNumber: 'L07',
        renderData: CardRenderer.builder((b) => {
          b.effect('Ignore placement restrictions for greenery and city tiles on Mars.',
            (eb) => eb.greenery().city().startEffect.asterix());
          b.br;
          b.effect('Gain 2 M€ when you place a greenery or city tile on Mars.',
            (eb) => eb.greenery().city().startEffect.megacredits(2));
        }),
      },
    });
  }

  public override canAct(): boolean {
    return false;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (space.spaceType === SpaceType.COLONY) {
      return;
    }
    if (cardOwner.game.phase === Phase.SOLAR) {
      return;
    }

    if (Board.isCitySpace(space) || Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new GainResources(cardOwner, Resource.MEGACREDITS, {count: 2, log: true}));
    }
    return;
  }
}
