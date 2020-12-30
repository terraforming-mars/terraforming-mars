
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class DomedCrater implements IProjectCard {
    public cost = 24;
    public tags = [Tags.CITY, Tags.BUILDING];
    public name = CardName.DOMED_CRATER;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 &&
        game.getOxygenLevel() <= 7 + player.getRequirementsBonus(game) &&
        game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for city tile',
        game.board.getAvailableSpacesForCity(player),
        (space: ISpace) => {
          game.addCityTile(player, space.id);
          player.plants += 3;
          player.addProduction(Resources.ENERGY, -1);
          player.addProduction(Resources.MEGACREDITS, 3);
          return undefined;
        },
      );
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: 'T03',
      requirements: CardRequirements.builder((b) => b.oxygen(7).max()),
      description: {
        text: 'Oxygen must be 7% or less. Gain 3 plants. Place a City tile. Decrease your Energy production 1 step and increase your MC production 3 steps.',
        align: 'left',
      },
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(3);
        }).nbsp.city().plants(3).digit.br;
      }),
      victoryPoints: 1,
    }
}
