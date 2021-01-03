import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';

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
          b.megacredits(1).slash().event().played.any;
        }),
        description: 'Gain 1 MC for each event EVER PLAYED by all players.',
      },
    });
  }

  public play(player: Player, game: Game) {
    let allPlayedEvents = 0;
    game.getPlayers().forEach((player: Player) => {
      player.playedCards.forEach((card) => {
        if (card.cardType === CardType.EVENT) {
          allPlayedEvents++;
        }
      });
    });
    player.megaCredits += allPlayedEvents;
    LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, allPlayedEvents);
    return undefined;
  }
}
