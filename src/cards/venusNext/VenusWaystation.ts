import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class VenusWaystation implements IProjectCard {
    public cost = 9;
    public tags = [Tags.VENUS, Tags.SPACE];
    public name = CardName.VENUS_WAYSTATION;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      return card.tags.filter((tag) => tag === Tags.VENUS).length * 2;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '258',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play a Venus tag, you pay 2 MC less for it.', (eb)=> {
          eb.venus(1).played.startEffect.megacredits(-2);
        });
      }),
      victoryPoints: 1,
    }
}
