import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {ISpace} from '../../boards/ISpace';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {Phase} from '../../../common/Phase';
import {SpaceType} from '../../../common/boards/SpaceType';
import {BoardType} from '../../boards/BoardType';
export class Ingrid extends CeoCard {
  constructor() {
    super({
      name: CardName.INGRID,
      metadata: {
        cardNumber: 'L09',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.emptyTile('normal').asterix().nbsp.colon().nbsp.plus().cards(1);
          b.br;
        }),
        description: 'When you take an action that places a tile on Mars THIS GENERATION, draw a card.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
    if (this.opgActionIsActive === false) return;
    if (boardType !== BoardType.MARS || space.spaceType !== SpaceType.LAND) return;
    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;

    cardOwner.game.defer(new SimpleDeferredAction(cardOwner, () => cardOwner.drawCard()));
  }
}
