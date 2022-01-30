import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {ResourceType} from '../../common/ResourceType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Fish extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.FISH,
      tags: [Tags.ANIMAL],
      cost: 9,

      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.temperature(2)),

      metadata: {
        cardNumber: '052',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP for each Animal on this card.');
        }),
        description: {
          text: 'Requires +2 C° or warmer. Decrease any Plant production 1 step.',
          align: 'left',
        },
      },
    });
  }
    public override resourceCount: number = 0;

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
