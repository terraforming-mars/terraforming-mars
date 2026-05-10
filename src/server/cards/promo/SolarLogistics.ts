import {Card} from '../Card';
import {IActionCard, ICard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {Resource} from '../../../common/Resource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class SolarLogistics extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SOLAR_LOGISTICS,
      cost: 20,
      tags: [Tag.EARTH, Tag.SPACE],
      resourceType: CardResource.DATA,

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
          b.effect('When any player plays a space event, remove 1 Data from this card to draw a card. (No effect if this card has no Data.)',
            (eb) => eb.tag(Tag.SPACE, {all}).tag(Tag.EVENT, {all}).startEffect.minus().resource(CardResource.DATA).colon().cards(1));
          b.br;
          b.action('Spend 1 Titanium to add 2 Data to any card.', (ab) => {
            ab.titanium(1).startAction.resource(CardResource.DATA, 2).asterix();
          });
          b.br;
          b.titanium(2);
        }),
        description: 'Gain 2 titanium.',
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.titanium >= 1;
  }

  public action(player: IPlayer) {
    player.stock.deduct(Resource.TITANIUM, 1);
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
    return undefined;
  }

  public onCardPlayedByAnyPlayer(thisCardOwner: IPlayer, card: ICard) {
    if (card.type === CardType.EVENT && card.tags.includes(Tag.SPACE)) {
      if (this.resourceCount > 0) {
        thisCardOwner.removeResourceFrom(this, 1, {log: true});
        thisCardOwner.drawCard(1);
      }
    }
    return undefined;
  }
}
