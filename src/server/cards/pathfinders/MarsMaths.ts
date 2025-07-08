import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class MarsMaths extends CorporationCard implements ICorporationCard {
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
        cardNumber: 'PfC10',
        description: 'You start with 40 M€. As your first action, draw 2 cards',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).nbsp.cards(2).br;
          b.effect('At the beginning of the Research phase, you draw 5 cards, but may STILL only buy 4 cards. If you are drafting, keep 2 cards for your first draft.', (eb) => {
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
