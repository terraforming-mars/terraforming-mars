import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MarsMaths extends CorporationCard {
  constructor() {
    super({
      name: CardName.MARS_MATHS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 40,

      firstAction: {
        text: 'Draw 2 cards',
        drawCard: {count: 2},
      },

      metadata: {
        cardNumber: 'PfCXX',
        description: 'You start with 40 M€. As your first action, draw 2 cards',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).nbsp.cards(2).br;
          b.effect('At the beginning of the Research phase, you draw 5 cards to choose from, but do not buy additional cards.', (eb) => {
            eb.empty().startEffect.plus().cards(1).asterix();
          }).br;
          b.action('Take another two actions this turn.', (eb) => {
            eb.empty().startAction.colon().nbsp.arrow().arrow();
          });
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: IPlayer) {
    player.availableActionsThisRound += 2;
    return undefined;
  }
}
