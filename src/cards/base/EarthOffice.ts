import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EarthOffice implements IProjectCard {
    public cost = 1;
    public tags = [Tags.EARTH];
    public name = CardName.EARTH_OFFICE;
    public cardType = CardType.ACTIVE;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      return card.tags.filter((tag) => tag === Tags.EARTH).length * 3;
    }

    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '105',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.earth().played.startEffect.megacredits(-3);
          eb.description('Effect: When you play an Earth card, you pay 3 MC less for it.');
        });
      }),
    };
}
