import {Card} from '../Card';
import {ICardMetadata} from '../ICardMetadata';
import {CardName} from '../../CardName';
import {CardType} from '../../cards/CardType';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {IProjectCard} from '../../cards/IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceBonus} from '../../SpaceBonus';
import {Tags} from '../../cards/Tags';
import {TileType} from '../../TileType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';

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
    public canPlay(player: Player): boolean {
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

    private _produce(player: Player, cb: (resource: Resources) => void = () => {}): void {
      if (this.bonusResource === undefined) {
        return;
      }

      const selectResource = (resource: Resources) => {
        player.addProduction(resource, 1, {log: true});
        cb(resource);
      };

      if (this.bonusResource.length === 1) {
        selectResource(this.bonusResource[0]);
      } else {
        player.game.defer(new DeferredAction(
          player,
          () => {
            return new OrOptions(
              new SelectOption('Gain steel production', 'Steel', () => {
                selectResource(Resources.STEEL);
                return undefined;
              }),
              new SelectOption('Gain titanium production', 'Titanium', () => {
                selectResource(Resources.TITANIUM);
                return undefined;
              }),
            );
          }));
      }
    }

    public produce(player: Player) {
      this._produce(player);
    }

    public play(player: Player): SelectSpace {
      return new SelectSpace(this.getSelectTitle(), this.getAvailableSpaces(player), (space: ISpace) => {
        const grantSteel = space.bonus.includes(SpaceBonus.STEEL);
        const grantTitanium = space.bonus.includes(SpaceBonus.TITANIUM);

        if (grantSteel && grantTitanium) {
          this.bonusResource = [Resources.TITANIUM, Resources.STEEL];
        } else if (grantSteel) {
          this.bonusResource = [Resources.STEEL];
        } else {
          this.bonusResource = [Resources.TITANIUM];
        }

        this._produce(player, (resource) => {
          const spaceBonus = resource === Resources.TITANIUM ? SpaceBonus.TITANIUM : SpaceBonus.STEEL;
          player.game.addTile(player, space.spaceType, space, {tileType: this.getTileType(spaceBonus)});
          space.adjacency = this.getAdjacencyBonus(spaceBonus);
        });
        return undefined;
      });
    }
}
