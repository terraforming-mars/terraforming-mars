import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resources} from '../../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';

export class RedTourismWave extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tag.EARTH],
      name: CardName.RED_TOURISM_WAVE,
      cardType: CardType.EVENT,

      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      metadata: {
        cardNumber: 'T12',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().emptyTile('normal', {size: Size.SMALL}).asterix();
        }),
        description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1 M€ from each EMPTY AREA ADJACENT TO YOUR TILES',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const amount = RedTourismWave.getAdjacentEmptySpacesCount(player);
    player.addResource(Resources.MEGACREDITS, amount);
    return undefined;
  }

  public static getAdjacentEmptySpacesCount(player: Player): number {
    const board = player.game.board;
    return board.getEmptySpaces().filter((space) =>
      board.getAdjacentSpaces(space).some((adj) =>
        adj.tile !== undefined && adj.player === player,
      )).length;
  }
}
