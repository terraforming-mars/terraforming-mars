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
        public title: string = "Select a card to discard",
        public drawBefore: boolean = false
    ){
        this.playerInput = new SelectCard(title, player.cardsInHand, (foundCards: Array<IProjectCard>) => {
            player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
            game.dealer.discard(foundCards[0]);
            return undefined;
          });
    };
    public beforeAction(): void {
        if (this.drawBefore) {
            this.player.cardsInHand.push(this.game.dealer.dealCard());
            this.playerInput = new SelectCard(this.title, this.player.cardsInHand, (foundCards: Array<IProjectCard>) => {
                this.player.cardsInHand.splice(this.player.cardsInHand.indexOf(foundCards[0]), 1);
                this.game.dealer.discard(foundCards[0]);
                return undefined;
              });            
        }
    }
}    
