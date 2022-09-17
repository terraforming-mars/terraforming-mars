import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardResource} from '../../../common/CardResource';
import {nextToNoOtherTileFn} from '../../boards/Board';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {max} from '../Options';

export class EarlyExpedition extends Card implements IProjectCard {
  // This card repeats the NEXT TO NO OTHER TILE behavior from Research Outpost, and Philares
  // has some similar code. Time for code reduction.

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.EARLY_EXPEDITION,
      cost: 15,
      tags: [Tag.SCIENCE, Tag.SPACE, Tag.CITY],
      requirements: CardRequirements.builder((b) => b.temperature(-18, {max})),

      behavior: {
        production: {energy: -1, megacredits: 3},
        addResourcesToAnyCard: {type: CardResource.DATA, count: 1},
      },

      metadata: {
        cardNumber: 'Pf18',
        renderData: CardRenderer.builder((b) => {
          b.minus().production((pb) => pb.energy(1)).production((pb) => pb.megacredits(3)).br;
          b.data().asterix().city().asterix();
        }),
        description: 'Temperature must be -18 C or lower. Decrease your energy production 1 step and ' +
          'Raise your M€ production 3 steps. Add 1 data to ANY card. Place a city tile on Mars NEXT TO NO OTHER TILE.',
      },
    });
  }

  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(nextToNoOtherTileFn(player.game.board));
  }

  public override bespokeCanPlay(player: Player) {
    return this.getAvailableSpaces(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace('Select place next to no other tile for city', this.getAvailableSpaces(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }
}
