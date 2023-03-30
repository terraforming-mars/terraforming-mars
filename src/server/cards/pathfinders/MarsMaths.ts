import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class MarsMaths extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.MARS_MATHS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 40,

      firstAction: {
        text: 'Draw 2 cards ',
        drawCard: {count: 2},
      },

      metadata: {
        cardNumber: 'PfCXX',
        description: 'You start with 43 M€. As your first action, draw 2 cards',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43).nbsp.cards(2).br;
          b.effect('At the beginning of the new generation, you draw 5 cards to choose from (instead of 4) but you can buy maximum 4 cards.', (eb) => {
            eb.empty().startEffect.plus().cards(1).asterix();
          }).br;
          b.action('Immediately take two additional actions.', (eb) => {
            eb.empty().startAction.colon().nbsp.arrow().arrow();
          });
        }),
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    // Just reduce actions taken this round by two
    player.actionsTakenThisRound--;
    player.actionsTakenThisRound--;
    return undefined;
  }

  public static isActive(player: Player): boolean {
    return player.cardIsInEffect(CardName.MARS_MATHS);
  }
}
