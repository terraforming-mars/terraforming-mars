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

export class IshtarMining implements IProjectCard {
    public cost = 5;
    public tags = [Tags.VENUS];
    public name = CardName.ISHTAR_MINING;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getVenusScaleLevel() >= 8 - (2 * player.getRequirementsBonus(game, true));
    }
    public play(player: Player) {
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '233',
      requirements: CardRequirements.builder((b) => b.venus(8)),
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.titanium(1))),
      description: 'Requires Venus 8%. Increase your titanium production 1 step.',
    };
}
