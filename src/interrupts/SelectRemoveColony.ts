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
        game.colonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
                game.colonies.splice(game.colonies.indexOf(colony),1);
                game.colonyDealer.discardedColonies.push(colony);
                return undefined;
            }
          );
          removeColony.options.push(colonySelect);
        });
        this.playerInput = removeColony;
        this.playerInput.onend = () => { 
            if (game.activePlayer !== player) {
                game.playerIsFinishedTakingActions();   
            } else {
                player.takeAction(game);
            }
        };
    };
}    



