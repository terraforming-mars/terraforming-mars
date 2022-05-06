import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Birds extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIRDS,
      tags: [Tags.ANIMAL],
      cost: 10,

      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.oxygen(13)),
      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: '072',
        description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add an animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(-2, {all});
          });
        }),
      },
    });
  }

  public override resourceCount = 0;

  public override canPlay(player: Player): boolean {
    return player.canReduceAnyProduction(Resources.PLANTS, 2);
  }
  public play(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.PLANTS, {count: 2}));
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
