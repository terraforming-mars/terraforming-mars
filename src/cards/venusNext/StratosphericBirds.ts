import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class StratosphericBirds implements IActionCard, IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.VENUS, Tags.ANIMAL];
    public name = CardName.STRATOSPHERIC_BIRDS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      const cardsWithFloater = player.getCardsWithResources().filter((card) => card.resourceType === ResourceType.FLOATER);
      if (cardsWithFloater.length === 0) return false;

      const meetsVenusRequirements = game.checkMinRequirements(player, GlobalParameter.VENUS, 12);

      if (cardsWithFloater.length > 1) {
        return meetsVenusRequirements;
      } else {
        const floaterCard = cardsWithFloater[0];
        if (floaterCard.name !== CardName.DIRIGIBLES) return meetsVenusRequirements;

        const canPayForFloater = ((floaterCard.resourceCount! - 1) * 3 + player.megaCredits) >= 12;
        return canPayForFloater && meetsVenusRequirements;
      }
    }
    public play(player: Player, game: Game) {
      game.defer(new RemoveResourcesFromCard(player, ResourceType.FLOATER, 1, true));
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '249',
      requirements: CardRequirements.builder((b) => b.venus(12)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 animal to this card.', (eb) => {
          eb.empty().startAction.animals(1);
        }).br;
        b.minus().floaters(1).br;
        b.vpText('1 VP for each Animal on this card.');
      }),
      description: {
        text: 'Requires Venus 12% and that you spend 1 Floater from any card.',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    };
}
