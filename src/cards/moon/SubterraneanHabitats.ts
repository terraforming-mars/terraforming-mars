import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {MoonCard} from './MoonCard';

export class SubterraneanHabitats extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBTERRANEAN_HABITATS,
      cardType: CardType.ACTIVE,
      cost: 12,
      reserveUnits: Units.of({steel: 2}),
      tr: {moonColony: 1},

      metadata: {
        description: 'Spend 2 steel. Raise the Colony Rate 1 step.',
        cardNumber: 'M36',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a colony on the Moon, you spend 1 titanium less.', (eb) => {
            eb.startEffect.moonColony().colon().minus().titanium(1);
          });
          b.br;
          b.minus().steel(2).moonColonyRate();
        }),
      },
    });
  };

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
