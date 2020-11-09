import {Colony, IColony} from '../../colonies/Colony';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Game} from '../../Game';
import {ColonyName} from '../../colonies/ColonyName';

export class Titania extends Colony implements IColony {
    public name = ColonyName.TITANIA;
    public description: string = 'VP';

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (this.trackPosition <= 2) {
        player.colonyVictoryPoints += 2;
      } else if (this.trackPosition <= 4) {
        player.colonyVictoryPoints += 1;
      }

      if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);

      if (this.colonies.length === 1) {
        player.colonyVictoryPoints += 5;
      } else if (this.colonies.length === 2) {
        player.colonyVictoryPoints += 3;
      } else if (this.colonies.length === 3) {
        player.colonyVictoryPoints += 2;
      }

      return undefined;
    }

    public giveTradeBonus(player: Player): undefined | PlayerInput {
      player.megaCredits = Math.max(player.megaCredits - 3, 0);
      return undefined;
    }
}
