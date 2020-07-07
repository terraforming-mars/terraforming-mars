
import { Game } from '../Game';
import { PlayerInput } from '../PlayerInput';
import { Player } from '../Player';
import { PlayerInterrupt } from './PlayerInterrupt';
import { Resources } from '../Resources';
import { SelectPlayer } from '../inputs/SelectPlayer';

export class SelectResourceProductionDecrease implements PlayerInterrupt {
    public playerInput: PlayerInput;
    constructor(
        public player: Player,
        public candidates: Array<Player>,
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to decrease " + resource  + " production by " + count + " step(s)"
    ) {
        this.playerInput = new SelectPlayer(
            candidates,
            this.title,
            (found: Player) => {
              found.setProduction(this.resource, -this.count, game, player);
              return undefined;
            }
        );
    };
}    
