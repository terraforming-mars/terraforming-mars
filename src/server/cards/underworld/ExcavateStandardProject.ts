import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCanPayWith, StandardProjectCard} from '../StandardProjectCard';
import {ExcavateSpacesDeferred} from '../../underworld/ExcavateSpacesDeferred';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class ExcavateStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.EXCAVATE_STANDARD_PROJECT,
    cost: 7,

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 7 M€ (steel may be used) to excavate a space.', (eb) => {
          eb.megacredits(7).super((b) => b.steel(1)).startAction.excavate();
        }),
      ),
    },
  }) {
    super(properties);
  }

  public override canPayWith(): StandardProjectCanPayWith {
    return {steel: true};
  }

  public override discount(player: IPlayer): number {
    if (player.game.getCardPlayerOrUndefined(CardName.EXCAVATOR_LEASING) !== undefined) {
      return 1;
    }
    return 0;
  }

  public override canAct(player: IPlayer): boolean {
    if (UnderworldExpansion.excavatableSpaces(player).length === 0) {
      return false;
    }
    return super.canAct(player);
  }

  actionEssence(player: IPlayer): void {
    player.game.defer(new ExcavateSpacesDeferred(player, 1));
  }
}
