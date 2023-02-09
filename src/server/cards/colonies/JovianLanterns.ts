import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';

export class JovianLanterns extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tag.JOVIAN],
      name: CardName.JOVIAN_LANTERNS,
      cardType: CardType.ACTIVE,

      resourceType: CardResource.FLOATER,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.tag(Tag.JOVIAN)),

      behavior: {
        tr: 1,
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 2},
      },

      metadata: {
        cardNumber: 'C18',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
            eb.titanium(1).startAction.floaters(2);
          }).br;
          b.tr(1).floaters(2).asterix().br;
          b.vpText('1 VP per 2 floaters here.');
        }),
        description: {
          text: 'Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY card.',
          align: 'left',
        },
      },
    });
  }


  public canAct(player: Player): boolean {
    return player.titanium > 0;
  }

  public action(player: Player) {
    player.titanium--;
    player.addResourceTo(this, 2);
    return undefined;
  }
}
