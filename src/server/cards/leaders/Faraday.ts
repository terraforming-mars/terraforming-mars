import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {IProjectCard} from '../IProjectCard';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Tag} from '../../../common/cards/Tag';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class Faraday extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.FARADAY,
      cardType: CardType.LEADER,
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

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return false;
  }

  public action(): PlayerInput | undefined {
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cardType === CardType.EVENT) return;
    if (!player.canAfford(2)) return;

    const excludedTags = [
      Tag.WILD,
      Tag.EVENT,
    ];
    const game = player.game;
    const validTags = game.getAllValidTags()
      .filter((item) => !excludedTags.includes(item))
      .filter((item) => card.tags.includes(item)); // filter for tags that are on the card we just played

    if (card.tags.length === 0) return;

    const uniqueCardTags = new Set(card.tags);
    uniqueCardTags.forEach((tag) => {
      if (!validTags.includes(tag)) return;
      // We need to work with cards that have more than one of the same tag.
      // To deal with these cards we calculate the modulo %5 of the tags the player two times:
      //  First we look at the number of tags before the card was played %5,
      //  Second we look at the number of tags _after_ the card was played %5:
      //  If the modulo _decreases_ it passed a multiple of 5.
      // ie: 4 Earth tags in play, a card with 1 Earth tag is played:
      //   Modulo #1: 4%5 == 4
      //   Moudlo #2: 5%5 == 0
      //   Modulo #1 > Modulo#2 (4>0), so we crossed a threshold of 5
      // ie2: 3 Space tags, one space tag played:
      //   Modulo #1: 3%5 == 3
      //   Moudlo #2: 4%5 == 4
      //   Modulo #1 < Modulo#2 (3<4), so we did not cross a threshold of 5
      // ie3:  Player has 4 Animal tags in play, plays a card with 2 animals:
      //   Modulo #1: 4%5 == 4
      //   Moudlo #2: 6%5 == 1
      //   Modulo #1 > Modulo#2 (4>1), so we crossed a threshold of 5
      // NB: This wont work if we ever have a card with >=5 tags... please dont make one of those.

      const playerTagCount = player.tags.count(tag, 'raw'); // Raw, no 'wild' Tags
      const cardTagCount = card.tags.filter((cardTag) => cardTag === tag).length;
      const playerTagCountWithoutCard = playerTagCount - cardTagCount;

      if (playerTagCountWithoutCard%5 > playerTagCount%5) {
        player.game.defer(new SimpleDeferredAction(player, () => this.effectOptions(player, tag)));
      }
    });
  }

  public effectOptions(player: Player, tag: Tag) {
    return new OrOptions(
      new SelectOption(`Pay 2 M€ to draw a ${tag} card`, 'Confirm', () => {
        player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for card'}));
        player.drawCard(1, {tag: tag});
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
