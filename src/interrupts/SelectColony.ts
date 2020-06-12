import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { OrOptions } from '../inputs/OrOptions';
import { IColony } from '../colonies/Colony';
import { SelectOption } from '../inputs/SelectOption';

export class SelectColony implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public tile: string = "Select where to build a colony"
    ){
        const buildColony = new OrOptions();
        buildColony.options = openColonies.map(colony => new SelectOption(
              colony.name + " - (" + colony.description + ")", 
              () => {
                colony.onColonyPlaced(player, game);
                return undefined;
              }
            ));
        this.playerInput = buildColony;
    };
}    
