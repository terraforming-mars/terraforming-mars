import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../common/ResourceType';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max, played} from '../Options';

export class Psychrophiles extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PSYCHROPHILES,
      tags: [Tags.MICROBE],
      cost: 2,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.temperature(-20, {max})),
      metadata: {
        cardNumber: 'P39',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.effect('When paying for a plant card, microbes here may be used as 2 M€ each.', (eb) => {
            eb.plants(1, {played}).startEffect.microbes(1).equals().megacredits(2);
          });
        }),
        description: 'Temperature must be -20 C or lower.',
      },
    });
  }
  public override resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
