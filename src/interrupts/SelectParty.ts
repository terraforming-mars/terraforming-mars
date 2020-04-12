import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { OrOptions } from '../inputs/OrOptions';
import { SelectOption } from '../inputs/SelectOption';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export class SelectParty implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = "Select where to send a delegate",
        public nbr: number = 1,
    ){
        const sendDelegate = new OrOptions();
        sendDelegate.options = game.turmoil!.parties.map(party => new SelectOption(
              party.name + " - (" + party.description + ")", 
              () => {
                for (let i = 0; i < nbr; i++) {
                  game.turmoil?.sendDelegateToParty(player, party.name, game);
                }
                game.log(
                  LogMessageType.DEFAULT,
                  "${0} sent "+ nbr + " delegate in ${1} area",
                  new LogMessageData(LogMessageDataType.PLAYER, player.id),
                  new LogMessageData(LogMessageDataType.PARTY, party.name)
                );
                return undefined;
              }
            ));
        this.playerInput = sendDelegate;
    };
}    
