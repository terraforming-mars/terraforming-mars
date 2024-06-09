import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class FreyjaBiodomes extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FREYJA_BIODOMES,
      type: CardType.AUTOMATED,
      tags: [Tag.PLANT, Tag.VENUS],
      cost: 14,

      requirements: {venus: 10},
      victoryPoints: 2,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: '227',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.MICROBE, {amount: 2, secondaryTag: Tag.VENUS}).or().resource(CardResource.ANIMAL, {amount: 2, secondaryTag: Tag.VENUS}).br;
          b.production((pb) => pb.minus().energy(1).nbsp.plus().megacredits(2));
        }),
        description: {
          text: 'Requires 10% on the Venus track. Add 2 microbes or 2 animals to another Venus card. Production: energy -1, M€ +2.',
          align: 'left',
        },
      },
    });
  }
  public getResCards(player: IPlayer): ICard[] {
    let resourceCards = player.getResourceCards(CardResource.ANIMAL);
    resourceCards = resourceCards.concat(player.getResourceCards(CardResource.MICROBE));
    return resourceCards.filter((card) => card.tags.includes(Tag.VENUS));
  }

  public override bespokePlay(player: IPlayer) {
    const cards = this.getResCards(player);

    if (cards.length > 1) {
      return new SelectCard(
        'Select card to add 2 resources',
        'Add resources',
        cards)
        .andThen(([card]) => {
          player.addResourceTo(card, {qty: 2, log: true});
          return undefined;
        });
    }

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {qty: 2, log: true});
    }
    return undefined;
  }
}
