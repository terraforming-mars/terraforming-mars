import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';
import { ISpace } from '../ISpace';
import { SpaceType } from '../SpaceType';
import * as constants from '../constants';
import { ColonyName } from './ColonyName';

export class Europa extends Colony implements IColony {
    public name = ColonyName.EUROPA;
    public trade(player: Player): void {
        if (this.trackPosition < 2) {
            player.setProduction(Resources.MEGACREDITS);
        } else if (this.trackPosition < 4) {
            player.setProduction(Resources.ENERGY);
        } else {
            player.setProduction(Resources.PLANTS);
        }
        this.afterTrade(this);
    }
    public onColonyPlaced(player: Player, game: Game): SelectSpace | undefined {
        this.colonies.push(player);
        if (game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) return undefined;

        return new SelectSpace(
            'Select a land space to place an ocean',
            game.board.getAvailableSpacesOnLand(player),
            (foundSpace: ISpace) => {
              game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
              return undefined;
            }
        );
    }
    public giveTradeBonus(player: Player): void {
        player.megaCredits++;
    }    
}