import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.energy(1)).slash().energy(2, {played}).influence({size: Size.SMALL});
});

export class ImprovedEnergyTemplates extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.IMPROVED_ENERGY_TEMPLATES,
      description: 'Increase energy production 1 step per 2 power tags (no limit). Influence counts as power tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      player.addProduction(Resources.ENERGY, Math.floor((player.getTagCount(Tags.ENERGY, 'raw') + turmoil.getPlayerInfluence(player)) / 2), {log: true, from: this.name});
    });
  }
}
