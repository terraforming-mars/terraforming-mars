import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class RemoveOcean implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select an Ocean tile to remove from board',
        public isWorldGov: boolean = false
    ){}

    public generatePlayerInput() {
        this.playerInput = new SelectSpace(
            this.title,
            this.game.board.getOceansTiles(),
            (space: ISpace) => {
                this.game.removeTile(space.id);
                return undefined;
            }
        );
    }
}    

