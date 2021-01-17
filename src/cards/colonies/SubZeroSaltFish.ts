import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {IResourceCard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class SubZeroSaltFish implements IProjectCard, IResourceCard {
    public cost = 5;
    public tags = [Tags.ANIMAL];
    public name = CardName.SUBZERO_SALT_FISH;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public canAct(): boolean {
      return true;
    }

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -6) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }

    public metadata: CardMetadata = {
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
    };
}
