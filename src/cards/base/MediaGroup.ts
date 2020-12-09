import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MediaGroup implements IProjectCard {
    public cost = 6;
    public tags = [Tags.EARTH];
    public name = CardName.MEDIA_GROUP;
    public cardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
      if (card.cardType === CardType.EVENT) {
        player.megaCredits += 3;
      }
    }
    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '109',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.event().played.startEffect.megacredits(3);
          eb.description('Effect: After you play an event card, you gain 3MC.');
        });
      }),
    }
}
