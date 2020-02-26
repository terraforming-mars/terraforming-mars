import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class SelectOcean implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title?: string
    ){
        if (title === undefined) {
            title = 'Select space for ocean tile';
        }
        this.playerInput = new SelectSpace(
            title,
            game.board.getAvailableSpacesForOcean(player),
            (space: ISpace) => {
                game.addOceanTile(player, space.id);
                game.pendingOceans--;
                return undefined;
            }
        );
    };
}    
