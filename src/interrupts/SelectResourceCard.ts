import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { SelectCard } from '../inputs/SelectCard';
import { ResourceType } from '../ResourceType';
import { ICard } from '../cards/ICard';

export class SelectResourceCard implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public resourceType: ResourceType,
        public resourceCards: Array<ICard>,
        public title?: string,
        public count: number = 1
    ){
        if (title === undefined) {
            title = 'Select card to add ' + count + ' ' + resourceType + ' resource';
        }
        this.playerInput = new SelectCard(
            title,
            resourceCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], count);
              return undefined;
            }
          );
        this.playerInput.onend = () => { 
            if (game.activePlayer !== player) {
                game.playerIsFinishedTakingActions();   
            } else {
                player.takeAction(game);
            }
        };
    };
}    