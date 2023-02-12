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
    const allTags = this.getAllValidTags(player);
    const validTags = allTags
      .filter((item) => card.tags.includes(item));

    const uniqueCardTags = new Set(card.tags);
    uniqueCardTags.forEach((tag) => {
      if (!validTags.includes(tag)) return;
      const playerTagCount = player.tags.count(tag, 'raw'); // Raw here means no Wild tags
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
        player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for action'}));
        player.drawCard(1, {tag: tag});
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }

  private getAllValidTags(player: Player): Array<Tag> {
    const tags = [
      Tag.BUILDING,
      Tag.SPACE,
      Tag.SCIENCE,
      Tag.POWER,
      Tag.EARTH,
      Tag.JOVIAN,
      Tag.PLANT,
      Tag.MICROBE,
      Tag.ANIMAL,
      Tag.CITY,
      // Tag.WILD,  // No Wild
      // Tag.EVENT, // No Event
      // Tag.CLONE,
    ];

    // On the players 'Tag Bar' VENUS is in between JOVIAN and PLANTS
    // It's nice to keep these in order for the player's own tag prompts
    const gOpts = player.game.gameOptions;
    if (gOpts.venusNextExtension) tags.splice(tags.indexOf(Tag.JOVIAN) + 1, 0, Tag.VENUS);
    if (gOpts.moonExpansion) tags.push(Tag.MOON);
    if (gOpts.aresExtension) tags.push(Tag.MARS);

    return tags;
  }
}
