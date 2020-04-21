import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class RemoveOcean implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title?: string,
        public isWorldGov: boolean = false
    ){
        if (title === undefined) {
            title = 'Select an Ocean tile to remove from board';
        }
        this.playerInput = new SelectSpace(
            title,
            game.board.getOceansTiles(),
            (space: ISpace) => {
                game.removeTile(space.id);
                return undefined;
            }
        );
    };
}    

