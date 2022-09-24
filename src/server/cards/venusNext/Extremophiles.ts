import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class Extremophiles extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.EXTREMOPHILES,
      cardType: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 3,
      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),
      metadata: {
        cardNumber: '224',
        description: 'Requires 2 science tags.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to ANY card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
          }).br;
          b.vpText('1 VP for every 3rd Microbe on this card.');
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const microbeCards = player.getResourceCards(CardResource.MICROBE);
    if (microbeCards.length === 1) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 microbe',
      'Add microbe',
      microbeCards,
      ([card]) => {
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );
  }
}
