import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {LavaFlows} from '../base/LavaFlows';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {BoardName} from '../../boards/BoardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class LavaTubeSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAVA_TUBE_SETTLEMENT,
      tags: [Tags.BUILDING, Tags.CITY],
      cost: 15,
      hasRequirements: false,
      productionDelta: Units.of({energy: -1, megacredits: 2}),

      metadata: {
        cardNumber: 'P37',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(2);
          }).br;
          b.city().asterix();
        }),
        description: 'Decrease your Energy production 1 step and increase your MC production 2 steps. Place a City Tile on a VOLCANIC AREA regardless of adjacent cities.',
      },
    });
  }

  private getSpacesForCity(player: Player, game: Game) {
    if (game.gameOptions.boardName === BoardName.HELLAS) {
      // https://boardgamegeek.com/thread/1953628/article/29627211#29627211
      return game.board.getAvailableSpacesForCity(player);
    }

    return LavaFlows.getVolcanicSpaces(player, game);
  }

  public canPlay(player: Player, game: Game): boolean {
    return this.getSpacesForCity(player, game).length > 0 && player.getProduction(Resources.ENERGY) >= 1;
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.ENERGY, -1);
    game.defer(new PlaceCityTile(
      player,
      game,
      'Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons',
      this.getSpacesForCity(player, game),
    ));
    return undefined;
  }
}
