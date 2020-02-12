import { Colony, IColony } from './Colony';
import { Player } from '../Player';
import { Resources } from '../Resources';
import { SelectSpace } from '../inputs/SelectSpace';
import { Game } from '../Game';
import { ISpace } from '../ISpace';
import * as constants from '../constants';
import { ColonyName } from './ColonyName';

export class Europa extends Colony implements IColony {
    public name = ColonyName.EUROPA;
    public trade(player: Player, game: Game): void {
        this.beforeTrade(this, player);
        if (this.trackPosition < 2) {
            player.setProduction(Resources.MEGACREDITS);
        } else if (this.trackPosition < 4) {
            player.setProduction(Resources.ENERGY);
        } else {
            player.setProduction(Resources.PLANTS);
        }
        this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player);
        if (game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) return undefined;

        let selectOcean = new SelectSpace(
            'Select space for Europa ocean tile',
            game.board.getAvailableSpacesForOcean(player),
            (space: ISpace) => {
                game.addOceanTile(player, space.id);
              return undefined;
            }
        );

        selectOcean.onend = () => { 
            game.interrupt = undefined;
            player.takeAction(game);
        }

        game.interrupt = {
            player: player,
            playerInput: selectOcean
        };
        return undefined;
    }
    public giveTradeBonus(player: Player): void {
        player.megaCredits++;
    }    
}