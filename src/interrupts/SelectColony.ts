import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { OrOptions } from '../inputs/OrOptions';
import { IColony } from '../colonies/Colony';
import { SelectOption } from '../inputs/SelectOption';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

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
                game.log(
                  LogMessageType.DEFAULT,
                  "${0} built a colony on ${1}",
                  new LogMessageData(LogMessageDataType.PLAYER, player.name),
                  new LogMessageData(LogMessageDataType.COLONY, colony.name)
                );
                return undefined;
              }
            ));
        this.playerInput = buildColony;
    };
}    
