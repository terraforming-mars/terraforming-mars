import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class NewColonyPlanningInitiaitives extends Card {
  constructor() {
    super({
      name: CardName.NEW_COLONY_PLANNING_INITIAITIVES,
      cardType: CardType.ACTIVE,
      cost: 6,

      metadata: {
        description: 'Requires Colony Rate to be 2 or higher. Raise Colony Rate 1 step.',
        cardNumber: 'M31',
        requirements: CardRequirements.builder((b) => b.colonyRate(2)),
        renderData: CardRenderer.builder((b) => {
          b.moonColonyRate(1);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).colonyRate >= 2;
  }

  public play(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
