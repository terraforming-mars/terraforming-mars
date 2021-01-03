import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {GlobalParameter} from '../../GlobalParameter';

export class Predators extends Card implements IProjectCard, IActionCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PREDATORS,
      tags: [Tags.ANIMAL],
      cost: 14,
      resourceType: ResourceType.ANIMAL,

      metadata: {
        cardNumber: '024',
        requirements: CardRequirements.builder((b) => b.oxygen(11)),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.animals(1).any.startAction.animals(1);
            eb.description('Action: Remove 1 Animal from any card and add it to this card.');
          }).br;
          b.text('1 VP per Animal on this card.', CardRenderItemSize.TINY, true);
        }),
        description: 'Requires 11% oxygen.',
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
      },
    });
  }

    public resourceCount: number = 0;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 11);
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }

    public play() {
      return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
      if (game.isSoloMode()) return true;
      return RemoveResourcesFromCard.getAvailableTargetCards(player, game, ResourceType.ANIMAL).length > 0;
    }

    public action(player: Player, game: Game) {
      game.defer(new RemoveResourcesFromCard(player, game, ResourceType.ANIMAL));
      game.defer(new DeferredAction(
        player,
        () => {
          player.addResourceTo(this);
          return undefined;
        },
      ));
      return undefined;
    }
}
