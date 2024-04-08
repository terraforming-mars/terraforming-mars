import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {digit} from '../../cards/Options';
import {Size} from '../../../common/cards/render/Size';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().excavate(2, {digit}).influence({size: Size.SMALL});
});

export class MigrationUnderground extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MIGRATION_UNDERGROUND,
      description: 'Gain 1 M€ production (max 5) for every 2 excavation markers you own. Each point of influence counts as an extra excavation marker.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const sum = UnderworldExpansion.excavationMarkerCount(player) + turmoil.getPlayerInfluence(player);
      const mc = Math.floor(sum / 2);
      const max = Math.min(mc, 5);
      player.production.add(Resource.MEGACREDITS, max, {log: true});
    });
  }
}
