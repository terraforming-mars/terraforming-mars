import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class FreyjaBiodomes extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FREYJA_BIODOMES,
      cardType: CardType.AUTOMATED,
      tags: [Tag.PLANT, Tag.VENUS],
      cost: 14,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      victoryPoints: 2,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: '227',
        renderData: CardRenderer.builder((b) => {
          b.microbes(2, {secondaryTag: Tag.VENUS}).or().animals(2, {secondaryTag: Tag.VENUS}).br;
          b.production((pb) => pb.minus().energy(1).nbsp.plus().megacredits(2));
        }),
        description: {
          text: 'Requires 10% on the Venus track. Add 2 Microbes or 2 Animals to another Venus card. Production: energy -1, M€ +2.',
          align: 'left',
        },
      },
    });
  }
  public getResCards(player: Player): ICard[] {
    let resourceCards = player.getResourceCards(CardResource.ANIMAL);
    resourceCards = resourceCards.concat(player.getResourceCards(CardResource.MICROBE));
    return resourceCards.filter((card) => card.tags.includes(Tag.VENUS));
  }

  public override bespokePlay(player: Player) {
    const cards = this.getResCards(player);

    if (cards.length > 1) {
      return new SelectCard(
        'Select card to add 2 resources',
        'Add resources',
        cards,
        ([card]) => {
          player.addResourceTo(card, {qty: 2, log: true});
          return undefined;
        },
      );
    }

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {qty: 2, log: true});
    }
    return undefined;
  }
}
