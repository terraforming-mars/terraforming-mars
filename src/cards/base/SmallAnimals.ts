import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {ResourceType} from '../../common/ResourceType';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class SmallAnimals extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SMALL_ANIMALS,
      tags: [Tags.ANIMAL],
      cost: 6,

      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.oxygen(6)),

      metadata: {
        cardNumber: '054',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires 6% oxygen. Decrease any Plant production 1 step.',
          align: 'left',
        },
      },
    });
  }
    public override resourceCount = 0;
    public override canPlay(player: Player): boolean {
      return player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    public play(player: Player) {
      player.game.defer(
        new DecreaseAnyProduction(player, Resources.PLANTS, {count: 1}));
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
