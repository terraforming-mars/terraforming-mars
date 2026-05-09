import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Tag} from '../../../common/cards/Tag';
import {PartyName} from '../../../common/turmoil/PartyName';
import {LoseProduction} from '../../deferredActions/LoseProduction';
import {Resource} from '../../../common/Resource';
import {MarsBoard} from '../../boards/MarsBoard';

export class FrontierTown extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FRONTIER_TOWN,
      type: CardType.AUTOMATED,
      cost: 11,
      tags: [Tag.CITY, Tag.BUILDING],

      requirements: {party: PartyName.MARS},

      metadata: {
        cardNumber: 'P74',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).city().asterix();
        }),
        description: 'Requires that Mars First is ruling or that you have 2 delegates there. ' +
        'Decrease your energy production one step. Place a city tile. ' +
        'GAIN THE PRINTED PLACEMENT BONUS 2 ADDITIONAL TIMES.',
      },
    });
  }

  private availableSpaces(player: IPlayer, cost: number) {
    return player.game.board.getAvailableSpacesForCity(
      player, {cost: cost, bonusMultiplier: 3});
  }

  public override bespokeCanPlay(player: IPlayer) {
    const available = this.availableSpaces(player, player.getCardCost(this));
    if (available.length === 0) {
      return false;
    }
    return MarsBoard.hasEnergyCoverage(player, available);
  }

  public override bespokePlay(player: IPlayer) {
    const spaces = MarsBoard.filterForEnergy(player, this.availableSpaces(player, 0));
    player.game.defer(new PlaceCityTile(player, {spaces})).andThen((space) => {
      player.game.defer(new LoseProduction(player, Resource.ENERGY, {count: 1}));
      if (space) {
        player.game.grantSpaceBonuses(player, space);
        player.game.grantSpaceBonuses(player, space);
      }
    });
    return undefined;
  }
}
