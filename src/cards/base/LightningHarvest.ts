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

export class LightningHarvest implements IProjectCard {
    public cost = 8;
    public tags = [Tags.ENERGY];
    public name = CardName.LIGHTNING_HARVEST;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 3;
    }
    public play(player: Player, _game: Game) {
      if (player.getTagCount(Tags.SCIENCE) < 3) {
        throw 'Requires 3 science tags';
      }
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.MEGACREDITS);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '046',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1).megacredits(1));
      }),
      description: 'Requires 3 Science tags. Increase your Energy production and your MC production up one step each.',
      victoryPoints: 1,
    }
}
