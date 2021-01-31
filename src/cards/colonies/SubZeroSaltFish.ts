import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {IResourceCard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class SubZeroSaltFish extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tags.ANIMAL],
      name: CardName.SUBZERO_SALT_FISH,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.ANIMAL,

      metadata: {
        cardNumber: 'C42',
        requirements: CardRequirements.builder((b) => b.temperature(-6)),
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1).any).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires -6 C. Decrease any Plant production 1 step.',
          align: 'left',
        },
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -6) && player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
  }

  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }

  public play(player: Player) {
    player.game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
    return undefined;
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }
}
