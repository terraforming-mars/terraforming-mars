import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {TileType} from '../../TileType';

export class MudSlides implements IGlobalEvent {
    public name = GlobalEventName.MUD_SLIDES;
    public description = 'Lose 4 MC for each tile adjacent to ocean (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const tiles = game.board.spaces.filter((space) => (space.player === player.id && space.tile !== undefined) &&
                               game.board.getAdjacentSpaces(space)
                                 .filter((space) => (space.tile !== undefined &&
                                           space.tile.tileType === TileType.OCEAN)).length > 0,
        ).length;
        const amount = Math.min(5, tiles) - turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.setResource(Resources.MEGACREDITS, -4 * amount, game, undefined, true);
        }
      });
    }
}
