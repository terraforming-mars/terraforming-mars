import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {digit} from '../Options';

export class StemFieldSubsidies extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.STEM_FIELD_SUBSIDIES,
      cost: 10,
      tags: [Tag.SCIENCE],
      resourceType: CardResource.DATA,

      action: {
        spend: {
          resourcesHere: 2,
        },
        underworld: {
          identify: {count: 3, claim: 1},
        },
      },

      metadata: {
        cardNumber: 'U043',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you play a science tag (including this), add 1 data to this card.',
            (eb) => eb.tag(Tag.SCIENCE).startEffect.resource(CardResource.DATA));
          b.br;
          b.action('Spend 2 resources here to identify 3 underground resources. Claim 1 of them.',
            (ab) => ab.resource(CardResource.DATA, {amount: 2}).startAction.identify(3, {digit}).claim(1));
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    const count = player.tags.cardTagCount(card, Tag.SCIENCE);
    this.onScienceTagAdded(player, count);
  }
  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.SCIENCE) {
      this.onScienceTagAdded(player, 1);
    }
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    player.addResourceTo(this, {qty: count, log: true});
  }
}
