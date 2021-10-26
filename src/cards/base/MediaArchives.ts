import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class MediaArchives extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MEDIA_ARCHIVES,
      tags: [Tags.EARTH],
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

  public play(player: Player) {
    const allPlayedEvents: number = player.game.getPlayers().map((player) => player.getPlayedEventsCount()).reduce((a, c) => a + c, 0);
    player.addResource(Resources.MEGACREDITS, allPlayedEvents, {log: true});
    return undefined;
  }
}
