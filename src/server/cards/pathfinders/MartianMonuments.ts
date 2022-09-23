import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';
import {Board} from '../../boards/Board';
import {SpaceType} from '../../../common/boards/SpaceType';

export class MartianMonuments extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MARTIAN_MONUMENTS,
      cost: 10,
      tags: [Tag.MARS, Tag.BUILDING],
      requirements: CardRequirements.builder((b) => b.cities(1, {text: 'ON MARS'})),

      behavior: {
        production: {megacredits: {tag: Tag.MARS}},
      },

      metadata: {
        cardNumber: 'Pf09',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().mars(1, {played});
        }),
        description: 'Requires that you own a city ON MARS. Raise your M€ production 1 step for every Mars tag you own (including this.)',
      },
    });
  }

  // Is this necessary?
  public override bespokeCanPlay(player: Player) {
    return player.game.board.spaces.some((space) => {
      return Board.isCitySpace(space) && space.player?.id === player.id && space.spaceType !== SpaceType.COLONY;
    });
  }
}

