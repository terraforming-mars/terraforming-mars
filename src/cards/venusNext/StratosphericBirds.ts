import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';

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

      const meetsVenusRequirements = game.getVenusScaleLevel() >= 12 - (2 * player.getRequirementsBonus(game, true));

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
      game.defer(new RemoveResourcesFromCard(player, game, ResourceType.FLOATER, 1, true));
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
}
