import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class CrescentResearchAssociation extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CRESCENT_RESEARCH_ASSOCIATION,
      tags: [Tag.SCIENCE, Tag.MOON],
      startingMegaCredits: 50,

      victoryPoints: VictoryPoints.tags(Tag.MOON, 1, 3),

      metadata: {
        description: 'You start with 50 M€. 1 VP for every 3 Moon tags you have.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(50).br;
          b.effect('When you play a moon tag, you pay 1 M€ less for each Moon tag you have.', (eb) => {
            eb.moon().startEffect.megacredits(1).slash().moon();
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MOON) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MOON);
  }
}
