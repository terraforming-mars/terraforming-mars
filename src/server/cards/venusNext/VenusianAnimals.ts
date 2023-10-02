import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class VenusianAnimals extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_ANIMALS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.ANIMAL, Tag.SCIENCE],
      cost: 15,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},

      requirements: {venus: 18},
      metadata: {
        cardNumber: '259',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a science tag, including this, add 1 animal to this card.', (eb)=> {
            eb.science(1, {played}).startEffect.animals(1);
          }).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires Venus 18%',
      },
    });
  }
  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    const qty = player.tags.cardTagCount(card, Tag.SCIENCE);
    player.addResourceTo(this, {qty, log: true});
  }
}
