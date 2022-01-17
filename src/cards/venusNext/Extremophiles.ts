import {ICard, IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class Extremophiles extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.EXTREMOPHILES,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 3,
      resourceType: ResourceType.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '224',
        description: 'Requires 2 Science tags.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to ANY card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
          }).br;
          b.vpText('1 VP for every 3rd Microbe on this card.');
        }),
      },
    });
  };

  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const microbeCards = player.getResourceCards(ResourceType.MICROBE);
    if (microbeCards.length === 1) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 microbe',
      'Add microbe',
      microbeCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});
        return undefined;
      },
    );
  }
}
