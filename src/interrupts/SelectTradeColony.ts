import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { OrOptions } from "../inputs/OrOptions";
import { IColony } from "../colonies/Colony";
import { SelectOption } from "../inputs/SelectOption";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export class SelectTradeColony implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public title = "Select conoly to trade with"
    ){
        const selectColony = new OrOptions();
        selectColony.options = openColonies.map(colony => new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            "Trade",
            () => {
              colony.trade(player, game);
              game.log(
                LogMessageType.DEFAULT,
                "${0} traded with ${1}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.COLONY, colony.name)
              );
              return undefined;
            }
          ));
        this.playerInput = selectColony;
    };
}    
