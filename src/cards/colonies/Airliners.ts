import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class Airliners implements IProjectCard {
    public cost = 11;
    public tags = [];
    public name = CardName.AIRLINERS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getResourceCount(ResourceType.FLOATER) >= 3;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 2);
      game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2));
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}

