import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class TitanShuttles implements IProjectCard, IResourceCard {
    public cost = 23;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.TITAN_SHUTTLES;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
      return true;
    }

    public action(player: Player, game: Game) {
      if (this.resourceCount === 0) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN, 'Add 2 floaters to a Jovian card'));
        return undefined;
      }

      return new OrOptions(
        new SelectOption('Add 2 floaters to a Jovian card', 'Add floaters', () => {
          game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2, Tags.JOVIAN));
          return undefined;
        }),
        new SelectAmount(
          'Remove X floaters on this card to gain X titanium',
          'Remove floaters',
          (amount: number) => {
            player.removeResourceFrom(this, amount);
            player.titanium += amount;
            game.log('${0} removed ${1} floaters to gain ${2} titanium', (b) => b.player(player).number(amount).number(amount));
            return undefined;
          },
          1,
          this.resourceCount,
        ),
      );
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
      return 1;
    }
}
