import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class OpenCity implements IProjectCard {
    public cost = 23;
    public tags = [Tags.CITY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.OPEN_CITY;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 12 - player.getRequirementsBonus(game) && player.getProduction(Resources.ENERGY) >= 1 && game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        player.addProduction(Resources.ENERGY, -1);
        player.addProduction(Resources.MEGACREDITS, 4);
        player.plants += 2;
        return undefined;
      });
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '108',
      requirements: CardRequirements.builder((b) => b.oxygen(12)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(4);
        }).city().plants(2);
      }),
      description: {
        text: 'Requires 12% oxygen. Gain 2 plants. Place a City tile. Decrease your Energy production 1 step and increase your MC production 4 steps.',
        align: 'left',
      },
      victoryPoints: 1,
    }
}
