import {Card, StaticCardProperties} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Phase} from '../../../common/Phase';
import {IProjectCard} from '../IProjectCard';
import {SpaceType} from '../../../common/boards/SpaceType';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Board} from '../../boards/Board';
import {AresHandler} from '../../ares/AresHandler';

/**
 * Abstraction for cards that give rewards based on tile placement.  (e.g. Ecological Survey, Geological Survey.)
 */
export abstract class SurveyCard extends Card implements IProjectCard {
  constructor(properties: StaticCardProperties) {
    super(properties);
  }

  /** The standard resources this card rewards. */
  protected abstract readonly STANDARD_RESOURCES: ReadonlyArray<readonly [SpaceBonus, Resource]>;
  /** The card resources this card rewards. */
  protected abstract readonly CARD_RESOURCES: ReadonlyArray<readonly [SpaceBonus, CardResource]>;

  private validPlaceAndPhase(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (cardOwner.game.phase === Phase.SOLAR) {
      return false;
    }
    if (cardOwner.id !== activePlayer.id) {
      return false;
    }
    // Space colonies are not on Mars.
    if (space.spaceType === SpaceType.COLONY) {
      return false;
    }
    // Does not work on The Moon.
    if (space.id.startsWith('m')) {
      return false;
    }
    return true;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (!this.validPlaceAndPhase(cardOwner, activePlayer, space)) {
      return;
    }

    for (const [bonus, resource] of this.STANDARD_RESOURCES) {
      if (this.spaceRewardsStandardResource(cardOwner, space, resource, bonus)) {
        cardOwner.stock.add(resource, 1);
        this.log(cardOwner, resource);
      }
    }
    for (const [bonus, resource] of this.CARD_RESOURCES) {
      this.maybeRewardCardResource(cardOwner, space, resource, bonus);
    }
  }

  public onStandardResourcePlacementBonus(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, chosen: Resource) {
    if (!this.validPlaceAndPhase(cardOwner, activePlayer, space)) {
      return;
    }

    for (const [bonus, resource] of this.STANDARD_RESOURCES) {
      // The card grants one additional per resource, so skip it when placing the tile already did.
      if (chosen === resource && !this.spaceRewardsStandardResource(cardOwner, space, resource, bonus)) {
        cardOwner.stock.add(resource, 1);
        this.log(cardOwner, resource);
      }
    }
  }

  private log(cardOwner: IPlayer, resource: Resource | CardResource): void {
    cardOwner.game.log(
      '${0} gained a bonus ${1} because of ${2}',
      (b) => b.player(cardOwner).string(resource).cardName(this.name));
  }

  /**
   * Returns true if when placing a tile on this space rewards `resource` either by the noted spaceBonus, or
   * through other effects (eg Arctic Algae, Turmoil policies)
   */
  private spaceRewardsStandardResource(cardOwner: IPlayer, space: Space, resource: Resource, bonus: SpaceBonus): boolean {
    const board = cardOwner.game.board;
    if (this.placedTileGivesBonus(space, bonus)) {
      return true;
    }
    if (AresHandler.anyAdjacentSpaceGivesBonus(board, space, bonus)) {
      return true;
    }
    switch (resource) {
    case Resource.STEEL:
      return PartyHooks.shouldApplyPolicy(cardOwner, PartyName.MARS, 'mp01');
    case Resource.PLANTS:
      if (Board.isUncoveredOceanSpace(space) && cardOwner.tableau.has(CardName.ARCTIC_ALGAE)) {
        return true;
      }
      return PartyHooks.shouldApplyPolicy(cardOwner, PartyName.GREENS, 'gp02');
    case Resource.HEAT:
      return PartyHooks.shouldApplyPolicy(cardOwner, PartyName.KELVINISTS, 'kp04');
    }
    return false;
  }

  /**
   * Optionally grants a unit of `resource` (which matches `bonus`) based on `cardOwner` having placed a tile on `space`.
   */
  private maybeRewardCardResource(cardOwner: IPlayer, space: Space, resource: CardResource, bonus: SpaceBonus) {
    const board = cardOwner.game.board;
    if (cardOwner.playedCards.some((card) => card.resourceType === resource) &&
        (this.placedTileGivesBonus(space, bonus) || AresHandler.anyAdjacentSpaceGivesBonus(board, space, bonus))) {
      cardOwner.game.defer(new AddResourcesToCard(
        cardOwner,
        resource,
        {log: true}))
        .andThen(() => this.log(cardOwner, resource));
    }
  }

  /**
   * Returns true if the tile just placed gives a bonus of a given type.
   */
  private placedTileGivesBonus(space: Space, bonus: SpaceBonus): boolean {
    return space.tile?.covers === undefined && space.bonus.includes(bonus);
  }
}
