import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { OrOptions } from "../inputs/OrOptions";
import { IColony } from "../colonies/Colony";
import { SelectOption } from "../inputs/SelectOption";

export class SelectTradeColony implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public openColonies: Array<IColony>,
        public title = "Select colony to trade with"
    ){}

    public generatePlayerInput() {
        const selectColony = new OrOptions();
        selectColony.options = this.openColonies.map(colony => new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            "Trade",
            () => {
                this.game.log("${0} traded with ${1}", b => b.player(this.player).colony(colony));
                colony.trade(this.player, this.game);              
                return undefined;
            }
        ));
       this.playerInput = selectColony;
    };
}    
