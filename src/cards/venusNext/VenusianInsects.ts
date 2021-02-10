import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class VenusianInsects extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_INSECTS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 5,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.venus(12)),
      metadata: {
        cardNumber: '260',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb)=> {
            eb.empty().startAction.microbes(1);
          }).br;
          b.vpText('1 VP for every 2nd Microbe on this card.');
        }),
        description: 'Requires Venus 12%.',
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 2),
      },
    });
  };
  public resourceCount: number = 0;
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 12);
  }
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
  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }
}
