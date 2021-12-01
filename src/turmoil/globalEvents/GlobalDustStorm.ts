import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';


const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('lose all').heat(1).br.megacredits(-2).slash().building(1, {played}).influence({size: Size.SMALL});
});

export class GlobalDustStorm implements IGlobalEvent {
    public name = GlobalEventName.GLOBAL_DUST_STORM;
    public description = 'Lose all heat. Lose 2 M€ for each Building tag (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        if (player.heat > 0) {
          player.deductResource(Resources.HEAT, player.heat, {log: true, from: this.name});
        }
        const maxedSteelTags = Math.min(5, player.getTagCount(Tags.BUILDING, 'raw'));
        player.deductResource(Resources.MEGACREDITS, 2 * Math.max(0, maxedSteelTags - turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
      });
    }
    public renderData = RENDER_DATA;
}
