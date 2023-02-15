import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {IProjectCard} from '../IProjectCard';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Tag} from '../../../common/cards/Tag';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class Faraday extends CeoCard {
  constructor() {
    super({
      name: CardName.FARADAY,
      metadata: {
        cardNumber: 'L27',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('5', Size.LARGE).diverseTag(1).colon().megacredits(-2).cards(1, {secondaryTag: AltSecondaryTag.DIVERSE}).asterix();
          b.br.br;
        }),
        description: 'When you gain a multiple of 5 for any tag type IN PLAY, you may pay 2 M€ to draw a card with that tag. Wild tags do not count for this effect.',
      },
    });
  }

  public override canAct(): boolean {
    return false;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.length === 0 || card.cardType === CardType.EVENT || !player.canAfford(2)) return;

    // Get all 'valid' tags that Player has in play after playing the card.
    const invalidTags = [
      Tag.EVENT,
      Tag.WILD,
    ];
    const playersValidTagCount = player.tags.getAllTags().filter((tag) => !invalidTags.includes(tag.tag));
    // Convert tags into an assocative array indexed by tag.
    //  This _could_ save CPU cycles instead of running multiple finds?
    // ie:
    // from:
    //    { tag: Tag.BUILDING, count: 5 },
    //    { tag: Tag.EARTH, count: 10 },
    //    { tag: Tag.POWER, count: 20 },
    // to:
    //    { Tag.BUILDING: 5, Tag.EARTH: 10, Tag.POWER: 20 }
    const countOfTags = playersValidTagCount.reduce((acc, cur) => {
      acc[cur.tag] = cur.count;
      return acc;
    }, {} as { [key in Tag]: number });

    const uniqueTagsOnCard = new Set(card.tags);
    uniqueTagsOnCard.forEach((tag) => {
      if (invalidTags.includes(tag)) return;
      const playerTagCount = countOfTags[tag];
      const cardTagCount = card.tags.filter((cardTag) => cardTag === tag).length;
      const playerTagCountPrePlay = playerTagCount - cardTagCount;
      // Modulo 5 what the tag count was before the card was played.
      // Sum that pre-played count with the new cards tags.  If this sum is >=5, offer a card draw.
      //  this wont work if someone makes a card with > 5 tags of one type, but...
      if (playerTagCountPrePlay%5 + cardTagCount >= 5) {
        player.game.defer(new SimpleDeferredAction(player, () => this.effectOptions(player, tag)));
      }
    });
  }

  public effectOptions(player: Player, tag: Tag) {
    return new OrOptions(
      new SelectOption(`Pay 2 M€ to draw a ${tag} card`, 'Confirm', () => {
        player.game.defer(
          new SelectPaymentDeferred(
            player,
            2,
            {
              title: 'Select how to pay for action',
              afterPay: () => {
                player.drawCard(1, {tag: tag});
              },
            },
          ),
        );
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
