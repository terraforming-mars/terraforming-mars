
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
        public game: Game,
        public resource: Resources,
        public count: number = 1,
        public title: string = "Select player to decrease " + resource  + " production by " + count + " step(s)"
    ){

        var players = game.getPlayers().filter((p) => p.getProduction(this.resource) >= count);
        if (players.length > 1) {
          players = players.filter((p) => p.id != this.player.id)
        }

        this.playerInput = new SelectPlayer(
            players,
            this.title,
            (found: Player) => {
              found.setProduction(this.resource, -this.count, game, player);
              return undefined;
            }
        );
    };
}    
