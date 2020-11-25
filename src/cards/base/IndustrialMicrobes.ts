
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class IndustrialMicrobes implements IProjectCard {
    public cost = 12;
    public tags = [Tags.MICROBES, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.INDUSTRIAL_MICROBES;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.STEEL);
      return undefined;
    }
}

