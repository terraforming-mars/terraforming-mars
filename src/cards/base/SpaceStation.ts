import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceStation implements IProjectCard {
    public cost = 10;
    public tags = [Tags.SPACE];
    public name = CardName.SPACE_STATION;
    public cardType = CardType.ACTIVE;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.SPACE) !== -1) {
        return 2;
      }
      return 0;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '025',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.space().played.startEffect.megacredits(-2);
          eb.description('Effect: When you play a Space card, you pay 2 MC less for it.');
        });
      }),
      victoryPoints: 1,
    };
}

