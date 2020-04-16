import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { TileType } from '../../TileType';

export class Riots implements IGlobalEvent {
    public name = GlobalEventName.RIOTS;
    public description = "Lose 4 M$ for each City tile (max 5, then reduced by influence).";
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const city = game.board.spaces.filter(
                (space) => space.tile !== undefined &&
                         space.tile.tileType === TileType.CITY &&
                         space.player === player
            ).length;
            const amount = Math.min(5, city) - turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, -4 * amount, undefined, undefined, true);
            }
        });    
    }
}    