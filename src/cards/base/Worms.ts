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

export class Worms implements IProjectCard {
    public cost = 8;
    public tags = [Tags.MICROBES];
    public cardType = CardType.AUTOMATED;
    public name = CardName.WORMS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, Math.floor((player.getTagCount(Tags.MICROBES) + 1) / 2));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '129',
      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1).slash().microbes(2).played);
      }),
      description: 'Requires 4% oxygen. Increase your Plant production 1 step for every 2 Microbe tags you have, including this.',
    }
}
