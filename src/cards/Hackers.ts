
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Hackers implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public name: string = CardName.HACKERS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length === 1) {
            player.setProduction(Resources.MEGACREDITS,2);
            player.setProduction(Resources.ENERGY,-1);
            return undefined;
        }
        return new SelectPlayer(game.getPlayers(), "Select player to decrease megacredits production 2 steps", (foundPlayer: Player) => {
            player.setProduction(Resources.ENERGY,-1);
            foundPlayer.setProduction(Resources.MEGACREDITS,-2,game,player);
            player.setProduction(Resources.MEGACREDITS,2);
            return undefined;
        });
    }
    public getVictoryPoints() {
        return -1;
    }
}

