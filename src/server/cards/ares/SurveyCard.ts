import {Card, StaticCardProperties} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {GainResources} from '../../deferredActions/GainResources';
import {Phase} from '../../../common/Phase';
import {IProjectCard} from '../IProjectCard';
import {BoardType} from '../../boards/BoardType';
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

  /**
   * Returns true if this space yields an adjacency bonus.
   */
  private anyAdjacentSpaceGivesBonus(board: Board, space: Space, bonus: SpaceBonus): boolean {
    return board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  /**
   * Returns true if the tile just placed gives a bonus of a given type.
   */
  private grantsBonusNow(space: Space, bonus: SpaceBonus) {
    return space.tile?.covers === undefined && space.bonus.includes(bonus);
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    // Adjacency bonuses are only available on Mars.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.game.phase === Phase.SOLAR || cardOwner.id !== activePlayer.id) {
      return;
    }

    this.checkForBonuses(cardOwner, space);
  }

  protected abstract checkForBonuses(cardOwner: IPlayer, space: Space): void;

  private log(cardOwner: IPlayer, resource: Resource | CardResource): void {
    cardOwner.game.log(
      '${0} gained a bonus ${1} because of ${2}',
      (b) => b.player(cardOwner).string(resource).cardName(this.name));
  }

  /**
   * Optionally grants a unit of `resource` (which matches `bonus`) based on `cardOwner` having placed a tile on `space`.
   */
  protected maybeRewardStandardResource(cardOwner: IPlayer, space: Space, resource: Resource, bonus: SpaceBonus): void {
    const board = cardOwner.game.board;
    let grant = this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(board, space, bonus);
    if (!grant) {
      switch (resource) {
      case Resource.STEEL:
        grant = space.spaceType !== SpaceType.COLONY &&
            PartyHooks.shouldApplyPolicy(cardOwner, PartyName.MARS, 'mfp01');
        break;
      case Resource.PLANTS:
        grant = Board.isUncoveredOceanSpace(space) &&
          cardOwner.cardIsInEffect(CardName.ARCTIC_ALGAE);
      }
    }
    if (grant) {
      cardOwner.game.defer(new GainResources(cardOwner, resource).andThen(() => this.log(cardOwner, resource)));
    }
  }

  /**
   * Optionally grants a unit of `resource` (which matches `bonus`) based on `cardOwner` having placed a tile on `space`.
   */
  protected maybeRewardCardResource(cardOwner: IPlayer, space: Space, resource: CardResource, bonus: SpaceBonus) {
    const board = cardOwner.game.board;
    if (cardOwner.playedCards.some((card) => card.resourceType === resource) &&
        (this.grantsBonusNow(space, bonus) || AresHandler.anyAdjacentSpaceGivesBonus(board, space, bonus))) {
      cardOwner.game.defer(new AddResourcesToCard(
        cardOwner,
        resource,
        {log: false}))
        .andThen(() => this.log(cardOwner, resource));
    }
  }
}
