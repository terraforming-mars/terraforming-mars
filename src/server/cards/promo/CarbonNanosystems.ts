import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Size} from '../../../common/cards/render/Size';

export class CarbonNanosystems extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.CARBON_NANOSYSTEMS,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 14,
      victoryPoints: 1,
      resourceType: CardResource.GRAPHENE,

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a science tag, including this, add a graphene resource here.', (eb) => eb.tag(Tag.SCIENCE).startEffect.resource(CardResource.GRAPHENE)).br;
          b.effect('When playing a space or city tag, graphenes may be used as 4 M€ each.', (eb) => eb.tag(Tag.SPACE).or().tag(Tag.CITY, {size: Size.MEDIUM}).startEffect.resource(CardResource.GRAPHENE).equals().megacredits(4)).br;
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    const tags = card.tags.filter((tag) => tag === Tag.SCIENCE).length;
    player.addResourceTo(this, {qty: tags, log: true});
    return undefined;
  }
  public onColonyAddedToLeavitt(player: IPlayer): void {
    player.addResourceTo(this, {qty: 1, log: true});
  }
}
