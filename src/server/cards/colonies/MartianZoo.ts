import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class MartianZoo extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tag.ANIMAL, Tag.BUILDING],
      name: CardName.MARTIAN_ZOO,
      type: CardType.ACTIVE,
      resourceType: CardResource.ANIMAL,
      requirements: {cities: 2, all},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C24',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, place an animal here.', (eb) => {
            eb.tag(Tag.EARTH).startEffect.resource(CardResource.ANIMAL);
          }).br;
          b.action('Gain 1M€ per animal here.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().resource(CardResource.ANIMAL);
          });
        }),
        description: {
          text: 'Requires 2 city tiles in play.',
          align: 'left',
        },
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    const count = player.tags.cardTagCount(card, Tag.EARTH);
    if (count > 0) {
      player.addResourceTo(this, count);
    }
  }

  public canAct(): boolean {
    return this.resourceCount > 0;
  }

  public action(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.resourceCount, {log: true});
    return undefined;
  }
}
