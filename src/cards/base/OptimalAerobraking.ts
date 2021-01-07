import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class OptimalAerobraking extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OPTIMAL_AEROBRAKING,
      tags: [Tags.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '031',
        renderData: CardRenderer.builder((b) => b.effect('When you play a Space Event, you gain 3 MC and 3 heat.', (be) => {
          be.space().played.event().played.startEffect.megacredits(3).heat(3);
        })),
      },
    });
  }

  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (card.cardType === CardType.EVENT && card.tags.indexOf(Tags.SPACE) !== -1) {
      player.megaCredits += 3;
      player.heat += 3;
    }
  }
  public play() {
    return undefined;
  }
}
