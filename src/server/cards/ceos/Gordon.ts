import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Board} from '../../boards/Board';
import {ISpace} from '../../boards/ISpace';
import {GainResources} from '../../deferredActions/GainResources';
import {Resources} from '../../../common/Resources';
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
          b.greenery().city().colon().megacredits(2).asterix();
          b.br.br;
        }),
        description: 'Ignore placement restrictions for greenery and city tiles on Mars. Gain 2 M€ when you place a greenery or city tile on Mars.',
      },
    });
  }

  public override canAct(): boolean {
    return false;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
    if (cardOwner.id !== activePlayer.id) return;
    if (boardType !== BoardType.MARS || space.spaceType !== SpaceType.LAND) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;

    if (Board.isCitySpace(space) || Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new GainResources(cardOwner, Resources.MEGACREDITS, {count: 2, log: true}));
    }
    return;
  }
}
