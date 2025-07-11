import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';

import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {message} from '../../logs/MessageBuilder';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';

export class ViralEnhancers extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VIRAL_ENHANCERS,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 9,

      metadata: {
        cardNumber: '074',
        renderData: CardRenderer.builder((b) => {
          b.tag(Tag.PLANT).slash().tag(Tag.MICROBE).slash().tag(Tag.ANIMAL).br;
          b.effect('When you play a plant, microbe, or an animal tag, including this, gain 1 plant or add 1 resource to THAT CARD.', (eb) => {
            eb.empty().startEffect;
            eb.plants(1).slash().resource(CardResource.MICROBE).asterix().slash().resource(CardResource.ANIMAL).asterix();
          });
        }),
      },
    });
  }

  private addPlant(player: IPlayer, count: number) {
    player.stock.add(Resource.PLANTS, count, {log: true, from: {card: this}});
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    const resourceCount = player.tags.cardTagCount(card, [Tag.ANIMAL, Tag.PLANT, Tag.MICROBE]);
    if (resourceCount === 0) {
      return undefined;
    }

    if (card.resourceType !== CardResource.ANIMAL && card.resourceType !== CardResource.MICROBE) {
      this.addPlant(player, resourceCount);
      return undefined;
    }

    for (let i = 0; i < resourceCount; i++) {
      player.defer(
        () => new OrOptions(
          new SelectOption(message('Add resource to card ${0}', (b) => b.card(card)), 'Add resource').andThen(() => {
            player.addResourceTo(card, {log: true});
            return undefined;
          }),
          new SelectOption('Gain plant').andThen(() => {
            this.addPlant(player, 1);
            return undefined;
          }),
        ),
      );
    }
    return undefined;
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.PLANT) {
      this.addPlant(player, 1);
    }
  }
}
