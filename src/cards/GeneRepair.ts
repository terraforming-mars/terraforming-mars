
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class GeneRepair implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SCIENCE];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GENE_REPAIR;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, _game: Game) {
      if (player.getTagCount(Tags.SCIENCE) < 3) {
        throw 'Requires 3 science tags.';
      }
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
