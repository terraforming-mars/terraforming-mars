import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

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
          b.megacredits(1).slash().event({played, all});
        }),
        description: 'Gain 1 M€ for each event EVER PLAYED by all players.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const allPlayedEvents = player.game.getPlayers().map((player) => player.getPlayedEventsCount()).reduce((a, c) => a + c, 0);
    player.addResource(Resource.MEGACREDITS, allPlayedEvents, {log: true});
    return undefined;
  }
}
