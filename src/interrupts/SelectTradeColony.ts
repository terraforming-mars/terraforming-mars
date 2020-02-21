import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { OrOptions } from '../inputs/OrOptions';
import { IColony } from '../colonies/Colony';
import { SelectOption } from '../inputs/SelectOption';

export class SelectTradeColony implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public title?: string
    ){
        if (title === undefined) {
            title = 'Select colony to trade with';
        }
        let selectColony = new OrOptions();
        openColonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
              colony.trade(player, game);
              game.log(player.name + " traded with " + colony.name);
              return undefined;
            }
          );
          selectColony.options.push(colonySelect);
        });
        this.playerInput = selectColony;
        this.playerInput.onend = () => { 
            if (game.activePlayer !== player) {
                game.playerIsFinishedTakingActions();   
            } else {
                player.takeAction(game);
            }
        };
    };
}    