import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {isIProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';

export class ArboristCollective extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.ARBORIST_COLLECTIVE,
      tags: [Tag.PLANT],
      startingMegaCredits: 40,
      resourceType: CardResource.ACTIVIST,

      behavior: {
        production: {plants: 2},
        stock: {plants: 2},
      },

      action: {
        spend: {resourcesHere: 2},
        stock: {plants: 2},
        production: {plants: 1},
      },

      metadata: {
        cardNumber: 'UC05',
        description: 'You start with 40 M€, 2 plants and 2 plant production.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).plants(2, {digit}).production((pb) => pb.plants(2)).br;
          b.effect('After you play an event card with a base cost of 14 or less, put an activist resource on this card.', (eb) => {
            eb.text('≤').megacredits(14, {secondaryTag: Tag.EVENT}).startEffect.resource(CardResource.ACTIVIST);
          }).br;
          b.action('Spend 2 activists here to increase your plant production 1 step and gain 2 plants.', (ab) => {
            ab.text('2').resource(CardResource.ACTIVIST).startAction.plants(2).production((pb) => pb.plants(1));
          });
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    if (isIProjectCard(card) && card.type === CardType.EVENT && card.cost <= 14) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }
}
