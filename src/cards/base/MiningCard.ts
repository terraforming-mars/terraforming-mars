
import {Card} from '../Card';
import {CardMetadata} from '../CardMetadata';
import {CardName} from '../../CardName';
import {CardType} from '../../cards/CardType';
import {Game} from '../../Game';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {IProjectCard} from '../../cards/IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {LogHelper} from '../../LogHelper';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceBonus} from '../../SpaceBonus';
import {Tags} from '../../cards/Tags';
import {TileType} from '../../TileType';

export abstract class MiningCard extends Card implements IProjectCard {
  constructor(
    name: CardName,
    cost: number,
    metadata: CardMetadata) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost,
      metadata,
    });
  }
    public bonusResource: Resources | undefined = undefined;
    public canPlay(player: Player, game: Game): boolean {
      return this.getAvailableSpaces(player, game).length > 0;
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
    protected getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
      return game.board.getAvailableSpacesOnLand(player)
      // Ares-only: exclude spaces already covered (which is only returned if the tile is a hazard tile.)
        .filter((space) => space.tile === undefined)
        .filter((space) => space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1);
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
    public play(player: Player, game: Game): SelectSpace {
      return new SelectSpace(this.getSelectTitle(), this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
        let bonus = SpaceBonus.STEEL;
        let resource = Resources.STEEL;
        if (foundSpace.bonus.includes(SpaceBonus.TITANIUM) === true) {
          bonus = SpaceBonus.TITANIUM;
          resource = Resources.TITANIUM;
        }
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: this.getTileType(bonus)});
        foundSpace.adjacency = this.getAdjacencyBonus(bonus);
        player.addProduction(resource);
        this.bonusResource = resource;
        LogHelper.logGainProduction(player, resource);
        return undefined;
      });
    }
}
