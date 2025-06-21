import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from './ICorporationCard';
import {CorporationCard} from './CorporationCard';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {ICard} from '../ICard';

export class SaturnSystems extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.SATURN_SYSTEMS,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 42,

      behavior: {
        production: {titanium: 1},
      },

      metadata: {
        cardNumber: 'R03',
        description: 'You start with 1 titanium production and 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(42);
          b.corpBox('effect', (ce) => {
            ce.effect('Each time any Jovian tag is put into play, including this, increase your M€ production 1 step.', (eb) => {
              eb.tag(Tag.JOVIAN, {all}).startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }

  public onCardPlayedByAnyPlayer(thisCardOwner: IPlayer, card: ICard) {
    // TODO(kberg): count the tags first. I don't know any cards with 2 jovian tags, though.
    for (const tag of card.tags) {
      if (tag === Tag.JOVIAN) {
        thisCardOwner.production.add(Resource.MEGACREDITS, 1, {log: true});
      }
    }
  }
}
