import {Card} from '../Card';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {SpaceBonus} from '../../SpaceBonus';
import {SpaceType} from '../../SpaceType';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class MetallicAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.METALLIC_ASTEROID,
      tags: [Tags.SPACE],
      cost: 13,

      metadata: {
        cardNumber: 'A13',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).titanium(1).br;
          b.minus().plants(4, {digit, all});
          b.tile(TileType.METALLIC_ASTEROID, false, true);
        }),
        description: 'Raise temperature 1 step and gain 1 titanium. Remove up to 4 plants from any player. Place this tile which grants an ADJACENCY BONUS of 1 titanium.',
      },
    });
  }
  public play(player: Player) {
    player.titanium++;
    player.game.increaseTemperature(player, 1);
    player.game.defer(new RemoveAnyPlants(player, 4));

    return new SelectSpace('Select space for Metallic Asteroid tile', player.game.board.getAvailableSpacesOnLand(player), (space: ISpace) => {
      player.game.addTile(player, SpaceType.LAND, space, {
        tileType: TileType.METALLIC_ASTEROID,
        card: this.name,
      });
      space.adjacency = {bonus: [SpaceBonus.TITANIUM]};
      return undefined;
    });
  }
}
