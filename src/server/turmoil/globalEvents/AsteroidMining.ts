import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../Turmoil';

import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class AsteroidMining extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ASTEROID_MINING,
      description: 'Gain 1 titanium for each Jovian tag (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.UNITY,
      renderData: CardRenderer.builder((b) => {
        b.titanium(1).slash().tag(Tag.JOVIAN).influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    player.stock.add(
      Resource.TITANIUM,
      Math.min(5, player.tags.count(Tag.JOVIAN, 'raw')) + turmoil.getInfluence(player),
      {log: true, from: {globalEvent: this}},
    );
  }
}
