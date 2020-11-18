import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {CardRenderer} from './render/CardRenderer';

export class OptimalAerobraking implements IProjectCard {
  public cost = 7;
  public tags = [Tags.SPACE];
  public cardType = CardType.ACTIVE;
  public name = CardName.OPTIMAL_AEROBRAKING;

  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (card.cardType === CardType.EVENT && card.tags.indexOf(Tags.SPACE) !== -1) {
      player.megaCredits += 3;
      player.heat += 3;
    }
  }
  public play() {
    return undefined;
  }

  public metadata: CardMetadata = {
    cardNumber: '031',
    renderData: CardRenderer.builder((b) => b.effectBox((be) => be.space().played.event().played.startEffect.megacredits(3).heat(3).description('Effect: When you play a Space Event, you gain 3 MC and 3 heat'))),
  };
}
