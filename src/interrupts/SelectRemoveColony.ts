import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { OrOptions } from '../inputs/OrOptions';
import { SelectOption } from '../inputs/SelectOption';

export class SelectRemoveColony implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game
    ){
        let removeColony = new OrOptions();
        removeColony.title = "Select colony to remove";
        removeColony.options = game.colonies.map(colony => new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
                game.colonies.splice(game.colonies.indexOf(colony),1);
                game.colonyDealer.discardedColonies.push(colony);
                return undefined;
            }
          ));
        this.playerInput = removeColony;
    };
}    



