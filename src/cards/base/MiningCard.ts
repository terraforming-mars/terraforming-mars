import {Card} from '../Card';
import {ICardMetadata} from '../ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {IProjectCard} from '../../cards/IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tags} from '../../common/cards/Tags';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {TileType} from '../../common/TileType';
import {SelectResourceTypeDeferred} from '../../deferredActions/SelectResourceTypeDeferred';

export abstract class MiningCard extends Card implements IProjectCard {
  constructor(
    name: CardName,
    cost: number,
    metadata: ICardMetadata) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost,
      metadata,
    });
  }
  public bonusResource?: Array<Resources>;
  public override canPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }
  private isAres(): boolean {
    return this.name === CardName.MINING_AREA_ARES ||
               this.name === CardName.MINING_RIGHTS_ARES;
  }
  private getAdjacencyBonus(bonusType: SpaceBonus): IAdjacencyBonus | undefined {
    if (this.isAres()) {
      return {bonus: [bonusType]};
    }
    return undefined;
  }
  protected getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
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

  public produce(player: Player) {
    if (this.bonusResource && this.bonusResource.length === 1) {
      player.addProduction(this.bonusResource[0], 1, {log: true});
    }
  }

  public play(player: Player): SelectSpace {
    return new SelectSpace(this.getSelectTitle(), this.getAvailableSpaces(player), (space: ISpace) => {
      const bonusResources = [];
      if (space.bonus.includes(SpaceBonus.STEEL)) {
        bonusResources.push(Resources.STEEL);
      }
      if (space.bonus.includes(SpaceBonus.TITANIUM)) {
        bonusResources.push(Resources.TITANIUM);
      }

      player.game.defer(new SelectResourceTypeDeferred(
        player, bonusResources,
        'Select a resource to gain 1 unit of production',
        (resource) => {
          player.addProduction(resource, 1, {log: true});
          this.bonusResource = [resource];
          const spaceBonus = resource === Resources.TITANIUM ? SpaceBonus.TITANIUM : SpaceBonus.STEEL;
          player.game.addTile(player, space.spaceType, space, {tileType: this.getTileType(spaceBonus)});
          space.adjacency = this.getAdjacencyBonus(spaceBonus);
        },
      ));
      return undefined;
    });
  }
}
