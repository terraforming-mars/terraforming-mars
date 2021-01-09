import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SpacePort implements IProjectCard {
    public cost = 22;
    public tags = [Tags.CITY, Tags.BUILDING];
    public name = CardName.SPACE_PORT;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.board.getAvailableSpacesForCity(player).length === 0) return false;
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      return coloniesCount > 0 && player.getProduction(Resources.ENERGY) > 0;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 4);
      player.addProduction(Resources.ENERGY, -1);
      player.increaseFleetSize();

      return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        return undefined;
      });
    }

    public metadata: CardMetadata = {
      cardNumber: 'C39',
      requirements: CardRequirements.builder((b) => b.colonies()),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(4);
        }).nbsp.city().br;
        b.tradeFleet();
      }),
      description: 'Requires 1 colony. Decrease your Energy production 1 step and increase your MC production 4 steps. Place a City tile. Gain 1 Trade Fleet.',
    }
}
