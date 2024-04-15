import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {MultiMap} from 'mnemonist';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.corruption().influence().colon();
  b.text('1st/2nd', Size.SMALL).corruption().production((pb) => pb.megacredits(3).slash().megacredits(1));
});

export class LaggingRegulation extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.LAGGING_REGULATION,
      description: 'Count corruption and ADD influence. Players with the most get 1 corruption and 3 M€ production. ' +
      'Players with 2nd most get 1 corruption and 1 M€ production. Min 1 to place. (SOLO: Place 1st with sum of 5 or more.)',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    const map: MultiMap<number, IPlayer> = new MultiMap();
    for (const player of game.getPlayers()) {
      map.set(player.underworldData.corruption + turmoil.getPlayerInfluence(player), player);
    }
    const totals = Array.from(map.keys());
    totals.sort(); // Largest value at the back.

    function reward(value: number | undefined, place: 1 | 2) {
      if (value === undefined || value === 0) {
        return;
      }
      const players = map.get(value);
      players?.forEach((player) => {
        UnderworldExpansion.gainCorruption(player, 1, {log: true});
        const mc = place === 1 ? 3 : 1;
        player.production.add(Resource.MEGACREDITS, mc, {log: true});
      });
    }
    reward(totals.pop(), 1);
    reward(totals.pop(), 2);
  }
}
