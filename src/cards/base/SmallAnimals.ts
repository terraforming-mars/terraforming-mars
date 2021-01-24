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

export class SmallAnimals extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SMALL_ANIMALS,
      tags: [Tags.ANIMAL],
      cost: 6,
      resourceType: ResourceType.ANIMAL,

      metadata: {
        cardNumber: '054',
        requirements: CardRequirements.builder((b) => b.oxygen(6)),
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1).any).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires 6% oxygen. Decrease any Plant production 1 step.',
          align: 'left',
        },
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    });
  }
    public resourceCount = 0;
    public canPlay(player: Player): boolean {
      return super.canPlay(player) && player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public play(player: Player) {
      player.game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
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
