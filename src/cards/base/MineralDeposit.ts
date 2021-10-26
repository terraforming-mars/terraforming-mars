import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MineralDeposit extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MINERAL_DEPOSIT,
      cost: 5,

      metadata: {
        cardNumber: '062',
        renderData: CardRenderer.builder((b) => b.steel(5, {digit})),
        description: 'Gain 5 steel.',
      },
    });
  }

  public play(player: Player) {
    player.steel += 5;
    return undefined;
  }
}
