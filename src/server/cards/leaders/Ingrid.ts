import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {ISpace} from '../../boards/ISpace';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {Phase} from '../../../common/Phase';
import {SpaceType} from '../../../common/boards/SpaceType';

export class Ingrid extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.INGRID,
      cardType: CardType.LEADER,
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

  public isDisabled = false;
  public opgActionIsActive = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (this.opgActionIsActive === false) return;
    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;
    if (space.spaceType === SpaceType.COLONY) return;

    cardOwner.game.defer(new SimpleDeferredAction(cardOwner, () => cardOwner.drawCard()));
  }
}
