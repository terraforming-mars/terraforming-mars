import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {BuildColony} from '../../deferredActions/BuildColony';

export class BuildColonyStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.BUILD_COLONY_STANDARD_PROJECT,
      cost: 17,
      metadata: {
        cardNumber: 'SP5',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 17 M€ to place a colony.', (eb) => {
            eb.megacredits(17).startAction.colonies();
          }),
        ),
      },
    });
  }

  protected override discount(player: IPlayer): number {
    const adhaiDiscount = Math.floor(player.resourcesOnCard(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS) / 2);
    return adhaiDiscount + super.discount(player);
  }

  public override canAct(player: IPlayer): boolean {
    return super.canAct(player) && player.colonies.getPlayableColonies(/* allowDuplicate= */ false, this.cost).length > 0;
  }

  actionEssence(player: IPlayer): void {
    player.game.defer(new BuildColony(player));
  }
}
