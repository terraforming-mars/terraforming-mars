import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Fish implements IActionCard, IProjectCard, IResourceCard {
    public cost = 9;
    public tags = [Tags.ANIMAL];
    public name = CardName.FISH;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 2) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
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
      cardNumber: '052',
      requirements: CardRequirements.builder((b) => b.temperature(2)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.animals(1);
          eb.description('Action: Add 1 Animal to this card.');
        }).br;
        b.productionBox((pb) => pb.minus().plants(1).any).br;
        b.text('1 VP for each Animal on this card.', CardRenderItemSize.TINY, true);
      }),
      description: {
        text: 'Requires +2 C° or warmer. Decrease any Plant production 1 step.',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    }
}
