import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {digit} from '../../cards/Options';
import {IPlayer} from '@/server/IPlayer';

export class GenerousFunding extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.GENEROUS_FUNDING,
      description: 'Gain 2 M€ for each influence and set of 5 TR over 15 (max 5 sets).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.UNITY,
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().influence().plus().tr(5, {digit, over: 15}).br.br;
      }),
    });
  }

  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const trSets = Math.max(0, Math.floor((player.terraformRating - 15) / 5));
    const maxTRSets = 5;
    const totalSets = Math.min(maxTRSets, trSets) + turmoil.getInfluence(player);
    player.stock.add(Resource.MEGACREDITS, 2 * totalSets, {log: true, from: {globalEvent: this}});
  }
}
