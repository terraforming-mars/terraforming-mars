
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CallistoPenalMines implements IProjectCard {
    public cost = 24;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.CALLISTO_PENAL_MINES;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 3);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      description: 'Increase your MC production 3 steps.',
      cardNumber: '082',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
        pb.megacredits(3);
      })),
      victoryPoints: 2,
    }
}
