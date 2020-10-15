import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class SelectCity implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for city tile'
    ){}

    public generatePlayerInput() {
        this.playerInput = new SelectSpace(
            this.title,
            this.game.board.getAvailableSpacesForCity(this.player),
            (space: ISpace) => {
                this.game.addCityTile(this.player, space.id);
                return undefined;
            }
        );
    }
}    
