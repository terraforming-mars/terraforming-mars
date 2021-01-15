import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SubterraneanHabitats implements IProjectCard {
  public cost = 12;
  public tags = [];
  public cardType = CardType.ACTIVE;
  public name = CardName.SUBTERRANEAN_HABITATS;

  public canPlay(_player: Player, _game: Game): boolean {
    return true;
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Spend 2 steel. Raise Colony Rate 1 step.',
    cardNumber: 'M36',
    renderData: CardRenderer.builder((b) => {
      b.effect('When you build a colony on the Moon, you spend 1 titanium less.', (eb) => {
        eb.moonColony().colon().minus().titanium(1);
      });
      b.minus().steel(2).moonColonyRate(1);
    }),
  };
}
