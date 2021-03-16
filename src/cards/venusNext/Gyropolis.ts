import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Gyropolis extends Card {
  constructor() {
    super({
      name: CardName.GYROPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 20,

      metadata: {
        cardNumber: '230',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().megacredits(1).slash().venus(1).played.br;
            pb.plus().megacredits(1).slash().earth().played.br;
          }).nbsp.city();
        }),
        description: 'Decrease your energy production 2 steps. Increase your MC production 1 step for each Venus and Earth tag you have. Place a City tile.',
      },
    });
  };
  public canPlay(player: Player): boolean {
    if (player.game.board.getAvailableSpacesForCity(player).length === 0) return false;
    return player.getProduction(Resources.ENERGY) >= 2;
  }
  public play(player: Player) {
    const tags: Array<Tags> = [Tags.VENUS, Tags.EARTH];
    player.addProduction(Resources.ENERGY, -2);
    player.addProduction(Resources.MEGACREDITS, player.getMultipleTagCount(tags), player.game);
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }
}
