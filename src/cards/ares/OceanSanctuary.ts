import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardName} from '../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {TileType} from '../../common/TileType';
import {CardType} from '../../common/cards/CardType';
import {IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class OceanSanctuary extends Card implements IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OCEAN_SANCTUARY,
      tags: [Tags.ANIMAL],
      cost: 9,
      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.oceans(5)),

      metadata: {
        cardNumber: 'A22',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.OCEAN_SANCTUARY, false, true).nbsp.animals(1).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 5 ocean tiles. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 animal. Add 1 animal to this card.',
      },
    });
  }
  public override resourceCount = 0;

  public play(player: Player) {
    player.addResourceTo(this, 1);
    return new SelectSpace(
      'Select space for Ocean Sanctuary',
      player.game.board.getOceanSpaces({upgradedOceans: false}),
      (space: ISpace) => {
        const tile = {
          tileType: TileType.OCEAN_SANCTUARY,
          card: this.name,
          covers: space.tile,
        };
        player.game.addTile(player, space.spaceType, space, tile);
        space.adjacency = {bonus: [SpaceBonus.ANIMAL]};
        return undefined;
      });
  }
}
