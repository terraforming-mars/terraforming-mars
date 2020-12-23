import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EarthCatapult implements IProjectCard {
  public cost = 23;
  public tags = [Tags.EARTH];
  public name = CardName.EARTH_CATAPULT;
  public cardType = CardType.ACTIVE;
  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
  public metadata: CardMetadata = {
    cardNumber: '070',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.empty().startEffect.megacredits(-2);
        eb.description('Effect: When you play a card, you pay 2 MC less for it.');
      });
    }),
    victoryPoints: 2,
  };
}
