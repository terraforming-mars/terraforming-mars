import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {all, played} from '../Options';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class IntragenSanctuaryHeadquarters extends CorporationCard {
  constructor() {
    super({
      name: CardName.INTRAGEN_SANCTUARY_HEADQUARTERS,
      tags: [Tag.ANIMAL, Tag.MOON],
      startingMegaCredits: 38,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        // Gains the initial resource from its own tag.
        addResources: 1,
      },

      firstAction: {
        text: 'Place a habitat tile on The Moon.',
        moon: {habitatTile: {}},
      },

      metadata: {
        description: 'You start with 38 M€. ' +
        'As your first action, place a habitat tile on The Moon and raise the habitat rate 1 step. 1 VP for every 2 animals on this card.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).br;
          b.effect('When any player plays an animal tag (including this), add 1 animal on this card.', (eb) => {
            eb.animals(1, {played, all}).startEffect.animals(1);
          }).br;
        }),
      },
    });
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard | ICorporationCard) {
    const count = player.tags.cardTagCount(card, Tag.ANIMAL);
    player.addResourceTo(this, count);
    return undefined;
  }
}
