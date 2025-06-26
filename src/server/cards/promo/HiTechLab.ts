import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardRenderer} from '../render/CardRenderer';

export class HiTechLab extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HI_TECH_LAB,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 17,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X04',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy to draw the same number of cards. TAKE 1 INTO HAND AND DISCARD THE REST.', (eb) => {
            eb.text('X').energy(1).startAction.text('X').cards(1).asterix();
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.energy > 0 && player.game.projectDeck.canDraw(1);
  }

  public action(player: IPlayer) {
    const max = Math.min(player.energy, player.game.projectDeck.size());
    return new SelectAmount('Select amount of energy to spend', 'OK', 1, max)
      .andThen((amount) => {
        player.stock.deduct(Resource.ENERGY, amount);
        player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(amount));
        if (amount === 1) {
          player.drawCard();
          return undefined;
        }
        player.drawCardKeepSome(amount, {keepMax: 1});
        return undefined;
      });
  }
}
