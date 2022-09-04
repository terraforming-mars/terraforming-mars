import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {played} from '../Options';

export class VenusianAnimals extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_ANIMALS,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.ANIMAL, Tag.SCIENCE],
      cost: 15,
      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),

      requirements: CardRequirements.builder((b) => b.venus(18)),
      metadata: {
        cardNumber: '259',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Science tag, including this, add 1 Animal to this card.', (eb)=> {
            eb.science(1, {played}).startEffect.animals(1);
          }).br;
          b.vpText('1 VP per Animal on this card.');
        }),
        description: 'Requires Venus 18%',
      },
    });
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    player.addResourceTo(this, player.tags.cardTagCount(card, Tag.SCIENCE));
  }
}
