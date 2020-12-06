import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

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
    public metadata: CardMetadata = {
      cardNumber: '091',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.megacredits(2))),
      description: 'Requires 3 science tags. Increase your MC production 2 steps.',
      victoryPoints: 2,
    };
}
