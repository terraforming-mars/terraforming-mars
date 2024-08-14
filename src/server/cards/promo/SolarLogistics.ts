import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class SolarLogistics extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SOLAR_LOGISTICS,
      cost: 20,
      tags: [Tag.EARTH, Tag.SPACE],

      behavior: {
        stock: {titanium: 2},
      },
      victoryPoints: 1,
      cardDiscount: {tag: Tag.EARTH, amount: 2},

      metadata: {
        cardNumber: 'X63',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, you pay 2 M€ less.',
            (eb) => eb.tag(Tag.EARTH).startEffect.megacredits(-2));
          b.br;
          b.effect('When any player plays a space event, draw a card.',
            (eb) => eb.tag(Tag.SPACE, {all}).tag(Tag.EVENT, {all}).startEffect.cards(1));
          b.br;
          b.titanium(2);
        }),
        description: 'Gain 2 titanium.',
      },
    });
  }

  public onCardPlayedFromAnyPlayer(thisCardOwner: IPlayer, _playedCardOwner: IPlayer, card: IProjectCard) {
    if (card.type === CardType.EVENT && card.tags.includes(Tag.SPACE)) {
      thisCardOwner.drawCard(1);
    }
    return undefined;
  }
}

