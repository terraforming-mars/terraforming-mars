import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Payment} from '../../../common/inputs/Payment';

export class JovianLanterns extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tag.JOVIAN],
      name: CardName.JOVIAN_LANTERNS,
      type: CardType.ACTIVE,

      resourceType: CardResource.FLOATER,
      victoryPoints: {resourcesHere: {}, per: 2},
      requirements: {tag: Tag.JOVIAN},

      behavior: {
        tr: 1,
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 2},
      },

      metadata: {
        cardNumber: 'C18',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
            eb.titanium(1).startAction.resource(CardResource.FLOATER, 2);
          }).br;
          b.tr(1).resource(CardResource.FLOATER, 2).asterix().br;
          b.vpText('1 VP per 2 floaters here.');
        }),
        description: {
          text: 'Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY card.',
          align: 'left',
        },
      },
    });
  }


  public canAct(player: IPlayer): boolean {
    return player.titanium > 0;
  }

  public action(player: IPlayer) {
    player.pay(Payment.of({titanium: 1}));
    player.addResourceTo(this, {qty: 2, log: true});
    return undefined;
  }
}
