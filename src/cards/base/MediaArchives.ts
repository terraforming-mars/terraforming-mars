import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MediaArchives implements IProjectCard {
    public cost = 8;
    public tags = [Tags.EARTH];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MEDIA_ARCHIVES;

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
    public metadata: CardMetadata = {
      cardNumber: '107',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(1).slash().event().played.any;
      }),
      description: 'Gain 1 MC for each event EVER PLAYED by all players.',
    }
}
