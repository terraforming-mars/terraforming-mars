import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { SelectCard } from '../inputs/SelectCard';
import { ICard } from "../cards/ICard";
import { OrOptions } from '../inputs/OrOptions';
import { Resources } from '../Resources';
import { SelectOption } from '../inputs/SelectOption';

export class SelectRemoveFloaters implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public floaterCards: Array<ICard>,
        public title: string = "Remove 2 floaters from a card or lose up to 10 MC"
    ){
        const selectAction = new OrOptions();
        const payMC = new SelectOption('Lose up to 10 MC', () => {
            player.setResource(Resources.MEGACREDITS, -10);
            return undefined;
          });
        const removeFloaters = new SelectCard(
            'Select card to remove 2 floaters from', floaterCards,
            (foundCards: Array<ICard>) => {
              player.removeResourceFrom(foundCards[0], 2);
              return undefined;
            }
        );
        selectAction.options.push(payMC, removeFloaters);
        this.playerInput = selectAction;
    };
}    
