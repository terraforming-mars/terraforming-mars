import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {IResourceCard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all} from '../Options';

export class SubZeroSaltFish extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tags.ANIMAL],
      name: CardName.SUBZERO_SALT_FISH,
      cardType: CardType.ACTIVE,

      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.temperature(-6)),

      metadata: {
        cardNumber: 'C42',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires -6 C. Decrease any Plant production 1 step.',
          align: 'left',
        },
      },
    });
  }

  public override resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public override canPlay(player: Player): boolean {
    return player.canReduceAnyProduction(Resources.PLANTS, 1);
  }

  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }

  public play(player: Player) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.PLANTS, {count: 1}));
    return undefined;
  }
}
