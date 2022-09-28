import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {LavaFlows} from '../base/LavaFlows';
import {CardName} from '../../../common/cards/CardName';
import {BoardName} from '../../../common/boards/BoardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';

export class LavaTubeSettlement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAVA_TUBE_SETTLEMENT,
      tags: [Tag.BUILDING, Tag.CITY],
      cost: 15,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: 'P37',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(2);
          }).br;
          b.city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 2 steps. Place a City Tile on a VOLCANIC AREA regardless of adjacent cities.',
      },
    });
  }

  private getSpacesForCity(player: Player) {
    if (player.game.gameOptions.boardName === BoardName.HELLAS) {
      // https://boardgamegeek.com/thread/1953628/article/29627211#29627211
      return player.game.board.getAvailableSpacesForCity(player);
    }

    return LavaFlows.getVolcanicSpaces(player);
  }

  public override bespokeCanPlay(player: Player): boolean {
    return this.getSpacesForCity(player).length > 0 && player.production.energy >= 1;
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceCityTile(
      player,
      'Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons',
      this.getSpacesForCity(player),
    ));
    return undefined;
  }
}
