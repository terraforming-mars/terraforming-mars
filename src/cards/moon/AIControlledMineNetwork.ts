import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class AIControlledMineNetwork implements IProjectCard {
  public cost = 6;
  public tags = [Tags.SCIENCE];
  public cardType = CardType.AUTOMATED;
  public name = CardName.AI_CONTROLLED_MINE_NETWORK;

  public readonly metadata: CardMetadata = {
    description: 'Requires Logistic Rate to be 2 or higher. Raise Logistic Rate 1 step',
    cardNumber: 'M32',
    requirements: CardRequirements.builder((b) => b.logisticRate(2)),
    renderData: CardRenderer.builder((b) => {
      b.moonLogisticsRate(1);
    }),
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).logisticRate >= 2;
  }

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
