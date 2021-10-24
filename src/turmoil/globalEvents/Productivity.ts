import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.steel(1).slash().production((pb) => pb.steel(1)).nbsp.influence({size: Size.SMALL});
});

export class Productivity implements IGlobalEvent {
    public name = GlobalEventName.PRODUCTIVITY;
    public description = 'Gain 1 steel for each steel production (max 5) and influence.';
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.MARS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.addResource(Resources.STEEL, Math.min(5, player.getProduction(Resources.STEEL)) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
      });
    }
    public renderData = RENDER_DATA;
}
