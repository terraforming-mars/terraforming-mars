import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';

export class RegoPlastics implements IProjectCard {
    public name = CardName.REGO_PLASTICS;
    public cost = 10;
    public tags = [Tags.STEEL];
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.increaseSteelValue();
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public onDiscard(player: Player): void {
      player.decreaseSteelValue();
    }
}
