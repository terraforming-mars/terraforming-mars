import {MultiSet} from 'mnemonist';
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
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

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

  // This _could_ save CPU cycles instead of running multiple finds?
  private countTags(player: Player): Record<Tag, number> {
    const record: Partial<Record<Tag, number>> = {};
    for (const entry of player.tags.getAllTags()) {
      record[entry.tag] = entry.count;
    }
    // This is safe because getAllTags returns all tags. I wish it were easy to initialize a Record type.
    return record as Record<Tag, number>;
  }

  private gainedMultiple(tagsOnCard: number, total: number): boolean {
    const priorTagCount = total - tagsOnCard;
    // Modulo 5 what the tag count was before the card was played.
    // Sum that pre-played count with the new cards tags.  If this sum is >=5, offer a card draw.
    // this wont work if someone makes a card with > 5 tags of one type, but...
    return priorTagCount % 5 + tagsOnCard >= 5;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.length === 0 || card.cardType === CardType.EVENT || !player.canAfford(2)) return;

    const counts = this.countTags(player);

    const tagsOnCard = MultiSet.from(card.tags);
    tagsOnCard.forEachMultiplicity((countOnCard, tagOnCard) => {
      if (INVALID_TAGS.includes(tagOnCard)) return;
      if (this.gainedMultiple(countOnCard, counts[tagOnCard])) {
        player.defer(this.effectOptions(player, tagOnCard));
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
