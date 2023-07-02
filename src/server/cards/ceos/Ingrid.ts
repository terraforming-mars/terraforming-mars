import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Space} from '../../boards/Space';
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
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    if (this.opgActionIsActive === false) return;
    // This filters for tiles only on mars (not moon), and includes Land+Oceans+'Coves'(landoceans)
    if (boardType !== BoardType.MARS || space.spaceType === SpaceType.COLONY) return;
    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;

    cardOwner.game.defer(new SimpleDeferredAction(cardOwner, () => cardOwner.drawCard()));
  }
}
