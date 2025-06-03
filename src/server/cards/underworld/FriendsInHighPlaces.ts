import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';

export class FriendsInHighPlaces extends Card {
  constructor() {
    super({
      name: CardName.FRIENDS_IN_HIGH_PLACES,
      type: CardType.ACTIVE,
      tags: [Tag.CRIME, Tag.EARTH],
      cost: 10,

      behavior: {
        underworld: {corruption: 1},
      },

      requirements: [{tag: Tag.EARTH, count: 1}, {corruption: 1}],

      metadata: {
        cardNumber: 'U41',
        description: 'Requires 1 corruption and 1 Earth tag. Gain 1 corruption.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When paying for Earth cards, corruption resources may be spent as 10 M€ each.',
            (eb) => eb.tag(Tag.EARTH).startEffect.corruption().equals().megacredits(10)).br;

          b.corruption().br;
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.canUseCorruptionAsMegacredits = true;
    return undefined;
  }

  public override onDiscard(player: IPlayer) {
    player.canUseCorruptionAsMegacredits = false;
  }
}
