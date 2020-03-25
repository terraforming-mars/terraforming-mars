import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class SelectGreenery implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for greenery tile'
    ){
        this.playerInput = new SelectSpace(
            title,
            game.board.getAvailableSpacesForGreenery(player),
            (space: ISpace) => {
                game.addGreenery(player, space.id);
                return undefined;
            }
        );
    };
}    
