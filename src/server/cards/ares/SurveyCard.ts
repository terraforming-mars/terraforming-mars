import {Card, StaticCardProperties} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
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

export abstract class SurveyCard extends Card implements IProjectCard {
  constructor(properties: StaticCardProperties) {
    super(properties);
  }

  private anyAdjacentSpaceGivesBonus(player: Player, space: ISpace, bonus: SpaceBonus): boolean {
    return player.game.board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  private grantsBonusNow(space: ISpace, bonus: SpaceBonus) {
    return space.tile?.covers === undefined && space.bonus.includes(bonus);
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

  private log(cardOwner: Player, resource: Resource | CardResource): void {
    cardOwner.game.log(
      '${0} gained a bonus ${1} because of ${2}',
      (b) => b.player(cardOwner).string(resource).cardName(this.name));
  }

  protected testForStandardResource(cardOwner: Player, space: ISpace, resource: Resource, bonus: SpaceBonus) {
    let grant = this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(cardOwner, space, bonus);
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
      cardOwner.game.defer(new GainResources(
        cardOwner,
        resource,
        {
          cb: () => this.log(cardOwner, resource),
        }));
    }
  }

  protected testForCardResource(cardOwner: Player, space: ISpace, resource: CardResource, bonus: SpaceBonus) {
    if (cardOwner.playedCards.some((card) => card.resourceType === resource) &&
        (this.grantsBonusNow(space, bonus) || this.anyAdjacentSpaceGivesBonus(cardOwner, space, bonus))) {
      cardOwner.game.defer(new AddResourcesToCard(
        cardOwner,
        resource,
        {
          log: () => this.log(cardOwner, resource),
        }));
    }
  }
}
