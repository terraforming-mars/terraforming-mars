import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Advertising implements IProjectCard {
  public name = CardName.ADVERTISING;
  public cost = 4;
  public tags = [Tags.EARTH];
  public cardType = CardType.ACTIVE;

  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (card.cost >= 20) {
      player.addProduction(Resources.MEGACREDITS);
    }
  }

  public play() {
    return undefined;
  }
  public metadata: CardMetadata = {
    cardNumber: 'X14',
    renderData: CardRenderer.builder((b) => b.effect('When you play a card with a basic cost of 20 MC or more, increase your MC production 1 step.', (be) => {
      be.megacredits(20).asterix().startEffect.production((pb) => pb.megacredits(1));
    })),
  };
}
