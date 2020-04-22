import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';
import { TileType } from '../../TileType';

export class StrongSociety implements IGlobalEvent {
    public name = GlobalEventName.STRONG_SOCIETY;
    public description = "Gain 2 M$ for each City tile (max 5) and influence.";
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            const amount = Math.min(5, game.getSpaceCount(TileType.CITY, player)) + turmoil.getPlayerInfluence(player);
            if (amount > 0) {
                player.setResource(Resources.MEGACREDITS, amount * 2, undefined, undefined, true);
            }
        });    
    }
}    