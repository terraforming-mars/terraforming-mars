import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {AddResourcesToCard} from '../../../server/deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';

export class ElonLabs extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ELON_LABS,
      tags: [Tag.WILD],
      startingMegaCredits: 40,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'R10',
        description: 'You start with 40 M€ and 2 M€ production.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.megacredits(1)).nbsp.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a card with requirements, add a NON-SCIENCE resource to any active card.', (eb) => {
              eb.cards(1, {secondaryTag: AltSecondaryTag.REQ}).startEffect.wild(1);
            });
          });
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    if (card.requirements.length) {
      player.game.defer(
        new AddResourcesToCard(
          player,
          undefined,
          {
            count: 1,
            filter: (card: ICard) => {
              return card.resourceType !== undefined && card.resourceType !== CardResource.SCIENCE;
            },
          },
        )
      );
    }
  }
}
