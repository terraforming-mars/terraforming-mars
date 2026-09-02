import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class EcoSabotage extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ECO_SABOTAGE,
      description: 'Lose all plants except 3 + influence.',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.REDS,
      renderData: CardRenderer.builder((b) => {
        b.text('max 3').plants(1).influence({size: Size.SMALL});
      }),
    });
  }

  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const plants = player.plants;
    const maxPlants = 3 + turmoil.getInfluence(player);
    const plantDecrease = Math.max(0, plants - maxPlants);
    player.stock.deduct(Resource.PLANTS, plantDecrease, {log: true, from: {globalEvent: this}});
  }
}
