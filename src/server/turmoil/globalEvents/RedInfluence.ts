import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {digit} from '../../cards/Options';
import {IPlayer} from '@/server/IPlayer';

export class RedInfluence extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.RED_INFLUENCE,
      description: 'Lose 3 M€ for each set of 5 TR over 10 (max 5 sets). Increase M€ production 1 step per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.REDS,
      behavior: {
        production: {
          megacredits: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(-3).slash().tr(5, {digit, over: 10}).nbsp.production((pb) => pb.megacredits(1)).slash().influence().br;
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const sets = Math.floor((player.terraformRating - 10)/5);
    if (sets > 0) {
      const amount = Math.min(sets, 5);
      player.stock.deduct(Resource.MEGACREDITS, amount * 3, {log: true, from: {globalEvent: this}});
    }
  }
}
