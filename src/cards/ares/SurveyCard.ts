import {Card, StaticCardProperties} from '../Card';
import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {GainResources} from '../../deferredActions/GainResources';
import {Phase} from '../../Phase';
import {IProjectCard} from '../IProjectCard';
import {BoardType} from '../../boards/BoardType';
import {SpaceType} from '../../SpaceType';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {TurmoilPolicy} from '../../turmoil/TurmoilPolicy';

export abstract class SurveyCard extends Card implements IProjectCard {
  constructor(properties: StaticCardProperties) {
    super(properties);
  }

  private anyAdjacentSpaceGivesBonus(player: Player, space: ISpace, bonus: SpaceBonus): boolean {
    return player.game.board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  private grantsBonusNow(space: ISpace, bonus: SpaceBonus) {
    return space.tile?.covers !== undefined && space.bonus.includes(bonus);
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
    // Adjacency bonuses are only available on Mars.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.game.phase === Phase.SOLAR || cardOwner.id !== activePlayer.id) {
      return;
    }

    this.checkForBonuses(cardOwner, space);
  }

  protected abstract checkForBonuses(cardOwner: Player, space: ISpace): void;

  protected testForStandardResource(cardOwner: Player, space: ISpace, resource: Resources, bonus: SpaceBonus) {
    let grant = this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(cardOwner, space, bonus);
    if (!grant) {
      switch (resource) {
      case Resources.STEEL:
        grant = space.spaceType !== SpaceType.COLONY &&
            PartyHooks.shouldApplyPolicy(cardOwner.game, PartyName.MARS, TurmoilPolicy.MARS_FIRST_DEFAULT_POLICY);
        break;
      case Resources.PLANTS:
        grant = space.tile?.tileType === TileType.OCEAN &&
          cardOwner.playedCards.some((card) => card.name === CardName.ARCTIC_ALGAE);
      }
    }
    if (grant) {
      cardOwner.game.defer(new GainResources(
        cardOwner,
        resource,
        {
          cb: () => cardOwner.game.log(
            '${0} gained a bonus ${1} because of ${2}',
            (b) => b.player(cardOwner).string(resource).cardName(this.name)),
        }));
    }
  }

  protected testForCardResource(cardOwner: Player, space: ISpace, resource: ResourceType, bonus: SpaceBonus) {
    if (cardOwner.playedCards.some((card) => card.resourceType === resource) &&
        (this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(cardOwner, space, bonus))) {
      cardOwner.game.defer(new AddResourcesToCard(
        cardOwner,
        resource,
        {
          logMessage: '${0} gained a bonus ${1} because of ${2}',
          logBuilder: (b) => b.player(cardOwner).string(resource).cardName(this.name),
        }));
    }
  }
  public play() {
    return undefined;
  }
}
