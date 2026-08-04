import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class MediaStir extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MEDIA_STIR,
      description: 'Lose 3 M€ per corruption resource you have (max 5), minus influence. Players with 0 corruption gain 1 TR.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              underworld: {corruption: {}},
              turmoil: {max: 5, influence: {subtract: true}},
              each: 3,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.megacredits(-3).slash().corruption().influence({size: Size.SMALL}).nbsp.text('0').corruption().colon().tr(1);
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    if (player.underworldData.corruption === 0) {
      player.increaseTerraformRating(1, {log: true, from: {globalEvent: this}});
    }
  }
}
