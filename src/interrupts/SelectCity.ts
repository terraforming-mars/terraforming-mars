import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { SelectSpace } from '../inputs/SelectSpace';
import { ISpace } from '../ISpace';
import { PlayerInterrupt } from './PlayerInterrupt';

export class SelectCity implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for city tile'
    ){
        this.playerInput = new SelectSpace(
            title,
            game.board.getAvailableSpacesForCity(player, game),
            (space: ISpace) => {
                game.addCityTile(player, space.id);
                return undefined;
            }
        );
    };
}    
