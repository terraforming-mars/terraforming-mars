import {CardName} from '../CardName';
import {CardType} from '../cards/CardType';
import {Game} from '../Game';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {IProjectCard} from '../cards/IProjectCard';
import {ISpace} from '../ISpace';
import {LogHelper} from '../components/LogHelper';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceBonus} from '../SpaceBonus';
import {Tags} from '../cards/Tags';
import {TileType} from '../TileType';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from '../deferredActions/DeferredAction';

export abstract class MiningCard implements IProjectCard {
    public abstract cost: number;
    public abstract name: CardName;
    public readonly tags: Array<Tags> = [Tags.STEEL];
    public readonly cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
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
          if (foundSpace.bonus.includes(SpaceBonus.STEEL) === false) {
            bonus = SpaceBonus.TITANIUM;
            resource = Resources.TITANIUM;
            this.increaseProduction(foundSpace, game, player, bonus, resource);
          } else {
            game.defer(new DeferredAction(
                player,
                () => {
                  return new OrOptions(
                      new SelectOption('Increase titanium production 1 step', 'Select', () => {
                        bonus = SpaceBonus.TITANIUM;
                        resource = Resources.TITANIUM;
                        this.increaseProduction(foundSpace, game, player, bonus, resource);
                        return undefined;
                      }),
                      new SelectOption('Increase steel production 1 step', 'Select', () => {
                        bonus = SpaceBonus.STEEL;
                        resource = Resources.STEEL;
                        this.increaseProduction(foundSpace, game, player, bonus, resource);
                        return undefined;
                      }),
                  );
                },
            ));
          }
        } else {
          this.increaseProduction(foundSpace, game, player, bonus, resource);
        }

        return undefined;
      });
    }

    private increaseProduction(
        foundSpace: ISpace,
        game: Game,
        player: Player,
        bonus: SpaceBonus.STEEL | SpaceBonus.TITANIUM,
        resource: Resources,
    ): void {
      game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: this.getTileType(bonus)});
      foundSpace.adjacency = this.getAdjacencyBonus(bonus);
      player.addProduction(resource);
      this.bonusResource = resource;
      LogHelper.logGainProduction(game, player, resource);
    }
}
