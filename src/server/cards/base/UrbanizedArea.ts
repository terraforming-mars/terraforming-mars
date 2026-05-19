import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardName} from '../../../common/cards/CardName';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {LoseProduction} from '../../deferredActions/LoseProduction';
import {Resource} from '../../../common/Resource';
import {MarsBoard} from '../../boards/MarsBoard';
import {Units} from '../../../common/Units';

export class UrbanizedArea extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.URBANIZED_AREA,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 10,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: '120',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(2);
          }).city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 2 steps. Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.',
      },
    });
  }
  public productionBox() {
    return Units.of({energy: -1, megacredits: 2});
  }

  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => player.game.board.getAdjacentSpaces(space).filter((adjacentSpace) => Board.isCitySpace(adjacentSpace)).length >= 2);
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    const available = this.getAvailableSpaces(player, canAffordOptions);
    if (available.length === 0) {
      return false;
    }
    return MarsBoard.hasEnergyCoverage(player, available);
  }

  public override bespokePlay(player: IPlayer) {
    const spaces = MarsBoard.filterForEnergy(player, this.getAvailableSpaces(player));
    player.game.defer(new PlaceCityTile(player, {
      title: 'Select space next to at least 2 other city tiles',
      spaces,
    })).andThen(() => {
      player.game.defer(new LoseProduction(player, Resource.ENERGY, {count: 1}));
    });
    return undefined;
  }
}
