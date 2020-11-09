
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class BeamFromAThoriumAsteroid implements IProjectCard {
    public cost = 32;
    public tags = [Tags.JOVIAN, Tags.SPACE, Tags.ENERGY];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BEAM_FROM_A_THORIUM_ASTEROID;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.JOVIAN) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.HEAT, 3);
      player.addProduction(Resources.ENERGY, 3);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}

