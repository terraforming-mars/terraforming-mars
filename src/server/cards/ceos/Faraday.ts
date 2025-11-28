import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {ICard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Tag} from '../../../common/cards/Tag';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {message} from '../../logs/MessageBuilder';
import {TITLES} from '../../inputs/titles';
import {Priority} from '../../deferredActions/Priority';

const INVALID_TAGS = [
  Tag.EVENT,
  Tag.WILD,
];

export class Faraday extends CeoCard {
  constructor() {
    super({
      name: CardName.FARADAY,
      metadata: {
        cardNumber: 'L27',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('5', Size.LARGE).diverseTag(1).colon().megacredits(-3).cards(1, {secondaryTag: AltSecondaryTag.DIVERSE}).asterix();
          b.br.br;
        }),
        description: 'When you gain a multiple of 5 for any tag type IN PLAY, you may pay 3 M€ to draw a card with that tag. Wild tags do not count for this effect.',
      },
    });
  }

  public data: {counts: Partial<Record<Tag, number>>} = {
    counts: {},
  };

  public override canAct(): boolean {
    return false;
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (card.tags.length === 0 || card.type === CardType.EVENT) {
      return;
    }

    this.processTags(player, card.tags);
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    this.processTags(player, [tag]);
  }

  private processTags(player: IPlayer, tags: ReadonlyArray<Tag>) {
    const rewards: Array<Tag> = [];

    for (const tag of tags) {
      if (INVALID_TAGS.includes(tag)) {
        return;
      }

      const count = player.tags.count(tag, 'raw');
      const lastReward = this.data.counts[tag] ?? 0;
      if (count >= lastReward + 5) {
        this.data.counts[tag] = count;
        rewards.push(tag);
      }
    }

    // TODO(kberg): If a player only has 4MC and surpasses with 2 tags, this is awkward
    player.defer(this.effectOptions(player, rewards), Priority.BEFORE_PHARMACY_UNION);
  }

  public effectOptions(player: IPlayer, tags: Array<Tag>) {
    const tag = tags.shift();
    if (tag === undefined) {
      return;
    }
    if (!player.canAfford(3)) {
      player.game.log(
        '${0} cannot afford to take advantage of the ${1} effect to draw a ${2} card',
        (b) => b.player(player).card(this).string(tag));
      return;
    }
    return new OrOptions(
      new SelectOption(message('Pay 3 M€ to draw a ${0} card', (b) => b.string(tag))).andThen(() => {
        player.game.defer(
          new SelectPaymentDeferred(
            player, 3, {title: TITLES.payForCardAction(this.name)}), Priority.BEFORE_PHARMACY_UNION)
          .andThen(() => {
            player.drawCard(1, {tag: tag});
            player.defer(this.effectOptions(player, tags), Priority.BEFORE_PHARMACY_UNION);
          });
        return undefined;
      }),
      new SelectOption('Do nothing'),
    );
  }
}
