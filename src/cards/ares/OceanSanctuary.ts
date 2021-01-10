import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class OceanSanctuary extends Card implements IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OCEAN_SANCTUARY,
      tags: [Tags.ANIMAL],
      cost: 9,
      resourceType: ResourceType.ANIMAL,

      metadata: {
        cardNumber: 'A22',
        requirements: CardRequirements.builder((b) => b.oceans(5)),
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.OCEAN_SANCTUARY, false, true).nbsp.animals(1).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 5 ocean tiles. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 animal. Add 1 animal to this card.',
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
      },
    });
  }
  public resourceCount = 0;

  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.OCEANS, 5);
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount);
  }

  public play(player: Player, game: Game) {
    this.resourceCount++;
    return new SelectSpace(
      'Select space for Ocean Sanctuary',
      game.board.getOceansTiles(false),
      (space: ISpace) => {
        game.removeTile(space.id);
        game.addTile(player, space.spaceType, space, {
          tileType: TileType.OCEAN_SANCTUARY,
        });
        space.adjacency = {bonus: [SpaceBonus.ANIMAL]};
        return undefined;
      });
  }
}
