import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MedicalLab implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SCIENCE, Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MEDICAL_LAB;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, Math.floor((player.getTagCount(Tags.BUILDING) + 1) / 2));
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '207',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(1).slash().building(2).played;
        });
      }),
      description: 'Increase your MC production 1 step for every 2 Building tags you have, including this.',
      victoryPoints: 1,
    }
}
