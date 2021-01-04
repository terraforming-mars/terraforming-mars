import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MineralDeposit extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MINERAL_DEPOSIT,
      cost: 5,

      metadata: {
        cardNumber: '062',
        renderData: CardRenderer.builder((b) => b.steel(5).digit),
        description: 'Gain 5 steel.',
      },
    });
  }

  public play(player: Player, _game: Game) {
    player.steel += 5;
    return undefined;
  }
}
