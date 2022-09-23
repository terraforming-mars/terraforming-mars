import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard, ICard, isIActionCard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Viron extends Card implements ICard, ICorporationCard {
  constructor() {
    super({
      name: CardName.VIRON,
      tags: [Tag.MICROBE],
      startingMegaCredits: 48,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R12',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(48);
          b.corpBox('action', (ce) => {
            ce.action('Use a blue card action that has already been used this generation.', (eb) => {
              eb.empty().startAction.empty();
            });
          });
        }),
      },
    });
  }

  private getActionCards(player: Player): Array<IActionCard & ICard> {
    const result: Array<IActionCard & ICard> = [];
    for (const playedCard of player.tableau) {
      if (isIActionCard(playedCard) &&
          player.getActionsThisGeneration().has(playedCard.name) &&
          playedCard.canAct(player)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public canAct(player: Player): boolean {
    return this.getActionCards(player).length > 0 && !player.getActionsThisGeneration().has(this.name);
  }

  public action(player: Player) {
    if (this.getActionCards(player).length === 0 ) {
      return undefined;
    }

    return new SelectCard(
      'Perform again an action from a played card',
      'Take action',
      this.getActionCards(player),
      ([card]) => {
        const foundCard = card;
        player.game.log('${0} used ${1} action with ${2}', (b) => b.player(player).card(foundCard).card(this));
        return foundCard.action(player);
      },
    );
  }
}
