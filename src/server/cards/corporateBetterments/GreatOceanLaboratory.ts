import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class GreatOceanLaboratory extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GREAT_OCEAN_LABORATORY,
      tags: [Tag.PLANT, Tag.SCIENCE],
      cost: 20,
      victoryPoints: {tag: Tag.MICROBE},
      requirements: {oceans: 5},
      metadata: {
        cardNumber: 'B16',
        description: 'Requires 5 Oceans in play. 1 VP for each Microbe tag you own.',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever a Microbe tag is played, including this, increase your M€ production 1 step.', (eb) => {
            eb.tag(Tag.MICROBE, {size: Size.SMALL}).startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.vpText('1 VP per Microbe tag you own.');
        }),
      },
    });
  }

  public onCardPlayedByAnyPlayer(cardOwner: IPlayer, card: ICard, activePlayer: IPlayer) {
    const count = activePlayer.tags.cardTagCount(card, Tag.MICROBE);
    for (let i = 0; i < count; i++) {
      cardOwner.production.add(Resource.MEGACREDITS, 1, {log: true});
    }
  }
}
