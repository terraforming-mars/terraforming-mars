import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Birds extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIRDS,
      tags: [Tags.ANIMAL],
      cost: 10,
      resourceType: ResourceType.ANIMAL,
      requirements: CardRequirements.builder((b) => b.oxygen(13)),
      metadata: {
        cardNumber: '072',
        description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add an animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(-2).any;
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
      },
    });
  }

    public resourceCount = 0;

    public canPlay(player: Player): boolean {
      return super.canPlay(player) && player.game.someoneHasResourceProduction(Resources.PLANTS, 2);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public play(player: Player) {
      player.game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 2));
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
