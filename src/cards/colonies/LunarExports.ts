import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class LunarExports implements IProjectCard {
    public cost = 19;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.LUNAR_EXPORTS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      return new OrOptions(
          new SelectOption('Increase your plant production by 2', 'Increase +plants', () => {
            player.addProduction(Resources.PLANTS, 2);
            return undefined;
          }),
          new SelectOption('Increase your MC production by 5', 'Increase +MC', () => {
            player.addProduction(Resources.MEGACREDITS, 5);
            return undefined;
          }),
      );
    }
}
