import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Arklight extends CorporationCard {
  constructor() {
    super({
      name: CardName.ARKLIGHT,
      tags: [Tag.ANIMAL],
      startingMegaCredits: 45,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        production: {megacredits: 2},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'R04',
        description: 'You start with 45 M€. Increase your M€ production 2 steps. 1 VP per 2 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).nbsp.production((pb) => pb.megacredits(2));
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an animal or plant tag, including this, add 1 animal to this card.', (eb) => {
              eb.animals(1, {played}).slash().plants(1, {played}).startEffect.animals(1);
            });
            ce.vSpace(); // to offset the description to the top a bit so it can be readable
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    if (player.isCorporation(CardName.ARKLIGHT)) {
      player.addResourceTo(this, {qty: card.tags.filter((cardTag) => cardTag === Tag.ANIMAL || cardTag === Tag.PLANT).length, log: true});
    }
  }
}
