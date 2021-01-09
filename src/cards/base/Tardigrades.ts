import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Tardigrades extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TARDIGRADES,
      tags: [Tags.MICROBE],
      cost: 4,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '049',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP per 4 Microbes on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 4),
      },
    });
  }
    public resourceCount = 0;
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 4);
    }
    public play() {
      return undefined;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
}
