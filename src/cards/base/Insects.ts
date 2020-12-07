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

export class Insects implements IProjectCard {
    public cost = 9;
    public tags = [Tags.MICROBES];
    public cardType = CardType.AUTOMATED;
    public name = CardName.INSECTS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, player.getTagCount(Tags.PLANT));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '148',
      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1).slash().plants(1).played);
      }),
      description: 'Requires 6% oxygen. Increase your Plant production 1 step for each plant tag you have.',
    }
}
