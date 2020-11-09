import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';

export class AsteroidDeflectionSystem implements IActionCard, IProjectCard, IResourceCard {
    public name = CardName.ASTEROID_DEFLECTION_SYSTEM;
    public cost = 13;
    public tags = [Tags.SPACE, Tags.EARTH, Tags.STEEL];
    public resourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, -1);
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player, game: Game) {
      const topCard = game.dealer.dealCard();
      if (topCard.tags.indexOf(Tags.SPACE) !== -1) player.addResourceTo(this);
      game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));
      game.dealer.discard(topCard);
      return undefined;
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }
}
