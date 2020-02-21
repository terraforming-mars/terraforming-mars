import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { SelectCard } from '../inputs/SelectCard';
import { IProjectCard } from '../cards/IProjectCard';

export class SelectDiscard implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title?: string
    ){
        if (title === undefined) {
            title = 'Select a card to discard';
        }
        this.playerInput = new SelectCard(title, player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
            game.dealer.discard(foundCards[0]);
            return undefined;
          });
        this.playerInput.onend = () => { 
            if (game.activePlayer !== player) {
                game.playerIsFinishedTakingActions();   
            } else {
                player.takeAction(game);
            }
        };
    };
}    