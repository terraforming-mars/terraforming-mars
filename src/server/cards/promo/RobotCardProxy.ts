import {CardName} from '../../../common/cards/CardName';
import {ProxyCard} from '../ProxyCard';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';

/** Used to Model Attached cards for the SelectCard player input */
export class RobotCardProxy extends ProxyCard {
  public override get resourceCount() {
    return this.resources;
  }
  constructor(
    name: CardName,
    public resources: number,
  ) {
    super(name);
  }
  public realCard(player: IPlayer): IProjectCard {
    const card = player.cardsInHand.find((card) => card.name === this.name);
    if (card !== undefined) {
      return card;
    } else {
      throw new Error('RobotProxyCard counterpart not in player hand.');
    }
  }
}
