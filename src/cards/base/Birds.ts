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
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Birds implements IActionCard, IProjectCard, IResourceCard {
    public cost = 10;
    public tags = [Tags.ANIMAL];
    public name = CardName.BIRDS;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 13 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS, 2);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 2));
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
      cardNumber: '072',
      description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card',
      requirements: CardRequirements.builder((b) => b.oxygen(13)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.animals(1);
          eb.description('Action: Add an animal to this card');
        }).br;
        b.productionBox((pb) => {
          pb.minus().plants(-2).any;
        });
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    };
}
