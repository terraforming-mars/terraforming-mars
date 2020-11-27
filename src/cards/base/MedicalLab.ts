
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class MedicalLab implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SCIENCE, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MEDICAL_LAB;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, Math.floor((player.getTagCount(Tags.STEEL) + 1) / 2));
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
