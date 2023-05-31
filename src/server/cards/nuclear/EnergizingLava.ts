import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardResource} from '../../../common/CardResource';
import {max} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class EnergizingLava extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ENERGIZING_LAVA,
      cost: 4,

      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION, 4, {max})),
      resourceType: CardResource.RADIATION,
      victoryPoints: {resourcesHere: {}, per: 3},

      metadata: {
        cardNumber: 'Pf55',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 heat to add 1 radiation to this card.', (eb) => {
            eb.heat(1).startAction.radiations(1);
          });
        }),
        description: 'Requires 4 radiation tags maximum. 1 VP per 4 radiations on this card.',
      },
    });
  }


  public canAct(player: Player) {
    return player.heat > 0;
  }

  public action(player: Player) {
    player.deductResource(Resource.HEAT, 1);
    player.addResourceTo(this);
    player.game.log('${0} spent 1 hear to place 1 radiation on ${1}.', (b) => b.player(player).card(this));
    return undefined;
  }
}

