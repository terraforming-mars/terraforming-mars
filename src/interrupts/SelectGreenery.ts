import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class SelectGreenery implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for greenery tile'
    ){}

    public generatePlayerInput() {
        this.playerInput = new SelectSpace(
            this.title,
            this.game.board.getAvailableSpacesForGreenery(this.player),
            (space: ISpace) => {
                this.game.addGreenery(this.player, space.id);
                return undefined;
            }
        );
    }
}    
