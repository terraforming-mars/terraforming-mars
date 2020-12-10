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

export class Moss implements IProjectCard {
    public cost = 4;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MOSS;
    public canPlay(player: Player, game: Game): boolean {
      const meetsOceanRequirements = game.board.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
      const hasViralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
      const hasEnoughPlants = player.plants >= 1 || hasViralEnhancers !== undefined || player.isCorporation(CardName.MANUTECH);

      return meetsOceanRequirements && hasEnoughPlants;
    }
    public play(player: Player) {
      player.plants--;
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '122',
      requirements: CardRequirements.builder((b) => b.oceans(3)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1)).nbsp.minus().plants(1);
      }),
      description: 'Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.',
    }
}

