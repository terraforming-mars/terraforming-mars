import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class SmallAnimals implements IActionCard, IProjectCard, IResourceCard {
    public cost = 6;
    public tags = [Tags.ANIMAL];
    public name = CardName.SMALL_ANIMALS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 1));
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '054',
      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.animals(1);
          eb.description('Action: Add 1 Animal to this card.');
        }).br;
        b.productionBox((pb) => pb.minus().plants(1).any).br;
        b.text('1 VP per 2 Animals on this card.', CardRenderItemSize.TINY, true);
      }),
      description: {
        text: 'Requires 6% oxygen. Decrease any Plant production 1 step.',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
    }
}
