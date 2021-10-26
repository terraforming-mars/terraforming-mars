import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class DeimosDownPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DEIMOS_DOWN_PROMO,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {temperature: 3},

      metadata: {
        cardNumber: 'X31',
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
          b.steel(4, {digit}).nbsp.minus().plants(-6, {all});
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new RemoveAnyPlants(player, 6));
    player.steel += 4;

    const availableSpaces = player.game.board.getAvailableSpacesForCity(player);

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.DEIMOS_DOWN});
      return undefined;
    });
  }
}
