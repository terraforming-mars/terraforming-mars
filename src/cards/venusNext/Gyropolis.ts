import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Gyropolis implements IProjectCard {
    public cost = 20;
    public tags = [Tags.CITY, Tags.BUILDING];
    public name = CardName.GYROPOLIS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      if (game.board.getAvailableSpacesForCity(player).length === 0) return false;
      return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, game: Game) {
      const tags: Array<Tags> = [Tags.VENUS, Tags.EARTH];
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.MEGACREDITS, player.getMultipleTagCount(tags));
      return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '230',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(2).br;
          pb.plus().megacredits(1).slash().venus(1).played.br;
          pb.plus().megacredits(1).slash().earth().played.br;
        }).nbsp.city();
      }),
      description: 'Decrease your energy production 2 steps. Increase your MC production 1 step for each Venus and Earth tag you have. Place a City tile.',
    };
}
