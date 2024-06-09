import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class CrescentResearchAssociation extends CorporationCard {
  constructor() {
    super({
      name: CardName.CRESCENT_RESEARCH_ASSOCIATION,
      tags: [Tag.SCIENCE, Tag.MOON],
      startingMegaCredits: 50,

      victoryPoints: {tag: Tag.MOON, per: 3},

      metadata: {
        description: 'You start with 50 M€. 1 VP for every 3 Moon tags you have.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).br;
          b.effect('When you play a Moon tag, you pay 1 M€ less for each Moon tag you have.', (eb) => {
            eb.tag(Tag.MOON).startEffect.megacredits(1).slash().tag(Tag.MOON);
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MOON) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MOON);
  }
}
