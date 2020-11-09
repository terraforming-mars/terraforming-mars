import {Colony, IColony} from './Colony';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {ColonyName} from './ColonyName';
import {ResourceType} from '../ResourceType';
import {Game} from '../Game';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';

export class Titan extends Colony implements IColony {
    public name = ColonyName.TITAN;
    public description: string = 'Floaters';
    public isActive = false;
    public resourceType = ResourceType.FLOATER;
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (usesTradeFleet) this.beforeTrade(this, player, game);

      let floaters: number = 0;
      if (this.trackPosition < 5) {
        floaters = Math.max(this.trackPosition - 1, 1);
      } else {
        floaters = this.trackPosition - 2;
      }

      game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, floaters));
      if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);
      game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 3));
      return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): undefined | PlayerInput {
      return (new AddResourcesToCard(player, game, ResourceType.FLOATER, 1)).execute();
    }
}
