import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {Player} from '../../../server/Player';
import {IProjectCard} from '../../../server/cards/IProjectCard';

export class OutOfThisWorld extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.OUT_OF_THIS_WORLD,
      tags: [Tag.SPACE],
      startingMegaCredits: 40,
      cardDiscount: [{tag: Tag.EARTH, amount: 2}, {tag: Tag.JOVIAN, amount: 2}, {tag: Tag.VENUS, amount: 2}],
      metadata: {
        cardNumber: 'B02',
        description: 'You start with 40 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(
              'Reduce the cost of Jovian/Venus/Earth tags by 2.',
              (eb) => {
                eb.jovian({played}).slash().earth(1, {played}).slash().venus(1, {played}).startEffect.megacredits(-2);
              },
            );
            ce.vSpace(Size.SMALL);
            ce.effect(
              'When you play 3 jovian tags, 3 earth tags, or 3 venus tags, gain 1 tr.',
              (eb) => {
                eb.text('3', Size.SMALL).jovian({played}).slash().text('3', Size.SMALL).earth(1, {played}).slash().text('3', Size.SMALL).venus(1, {played}).startEffect.tr(1, {size: Size.TINY});
              },
            );
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (player.isCorporation(this.name)) {
      let tags = card.tags.filter(((tag) => [Tag.JOVIAN, Tag.EARTH, Tag.VENUS].includes(tag)));
      tags = [...new Set(tags)];
      tags.forEach((tag) => {
        if (player.tags.count(tag) === 3) {
          player.increaseTerraformRating();
        }
      });
    }
  }
}
