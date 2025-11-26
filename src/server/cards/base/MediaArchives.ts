import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {Resource} from '@/common/Resource';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';
import {sum} from '@/common/utils/utils';

export class MediaArchives extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MEDIA_ARCHIVES,
      tags: [Tag.EARTH],
      cost: 8,

      metadata: {
        cardNumber: '107',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().tag(Tag.EVENT, {all});
        }),
        description: 'Gain 1 M€ for each event EVER PLAYED by all players.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const allPlayedEvents = sum(player.game.players.map((player) => player.getPlayedEventsCount()));
    player.stock.add(Resource.MEGACREDITS, allPlayedEvents, {log: true});
    return undefined;
  }
}
