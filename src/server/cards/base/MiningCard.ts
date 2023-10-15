import {Card} from '../Card';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {IProjectCard} from '../../cards/IProjectCard';
import {Space} from '../../boards/Space';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tag} from '../../../common/cards/Tag';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

export abstract class MiningCard extends Card implements IProjectCard {
  constructor(
    name: CardName,
    cost: number,
    metadata: ICardMetadata) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.BUILDING],
      cost,
      metadata,
    });
  }
  public bonusResource?: Array<Resource>;
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }
  private isAres(): boolean {
    return this.name === CardName.MINING_AREA_ARES ||
               this.name === CardName.MINING_RIGHTS_ARES;
  }
  private getAdjacencyBonus(bonusType: SpaceBonus): AdjacencyBonus | undefined {
    if (this.isAres()) {
      return {bonus: [bonusType]};
    }
    return undefined;
  }
  protected getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      // Ares-only: exclude spaces already covered (which is only returned if the tile is a hazard tile.)
      .filter((space) => space.tile === undefined)
      .filter((space) => space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM));
  }
  private getSelectTitle(): string {
    let result = 'Select a space with a steel or titanium bonus';
    if (this.name === CardName.MINING_AREA || this.name === CardName.MINING_AREA_ARES) {
      result += ' adjacent to one of your tiles';
    }
    return result;
  }

  private getTileType(bonus: SpaceBonus.STEEL | SpaceBonus.TITANIUM): TileType {
    if (this.isAres()) {
      return bonus === SpaceBonus.STEEL ? TileType.MINING_STEEL_BONUS : TileType.MINING_TITANIUM_BONUS;
    }
    if (this.name === CardName.MINING_RIGHTS) {
      return TileType.MINING_RIGHTS;
    }
    return TileType.MINING_AREA;
  }

  public produce(player: IPlayer) {
    if (this.bonusResource && this.bonusResource.length === 1) {
      player.production.add(this.bonusResource[0], 1, {log: true});
    }
  }

  public override bespokePlay(player: IPlayer): SelectSpace {
    return new SelectSpace(this.getSelectTitle(), this.getAvailableSpaces(player))
      .andThen((space) => {
        const bonusResources = [];
        if (space.bonus.includes(SpaceBonus.STEEL)) {
          bonusResources.push(Resource.STEEL);
        }
        if (space.bonus.includes(SpaceBonus.TITANIUM)) {
          bonusResources.push(Resource.TITANIUM);
        }

        player.game.defer(
          new SelectResourceTypeDeferred(
            player,
            bonusResources,
            'Select a resource to gain 1 unit of production'))
          .andThen((resource) => {
            player.production.add(resource, 1, {log: true});
            this.bonusResource = [resource];
            const spaceBonus = resource === Resource.TITANIUM ? SpaceBonus.TITANIUM : SpaceBonus.STEEL;
            player.game.addTile(player, space, {tileType: this.getTileType(spaceBonus)});
            space.adjacency = this.getAdjacencyBonus(spaceBonus);
          });
        return undefined;
      });
  }
}
