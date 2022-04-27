import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';
import {Board} from '../../boards/Board';
import {SpaceType} from '../../common/boards/SpaceType';

export class MartianMonuments extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MARTIAN_MONUMENTS,
      cost: 5,
      tags: [Tags.EARTH, Tags.MARS],
      requirements: CardRequirements.builder((b) => b.cities(1, {text: 'ON MARS'})),

      metadata: {
        cardNumber: 'Pf09',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().mars(1, {played});
        }),
        description: 'Requires that you own a city ON MARS. Raise your M€ production 1 step for every Mars tag you own (including this.)',
      },
    });
  }

  public override canPlay(player: Player) {
    return player.game.board.spaces.some((space) => {
      return Board.isCitySpace(space) && space.player?.id === player.id && space.spaceType !== SpaceType.COLONY;
    });
  }

  public play(player: Player) {
    const count = player.getTagCount(Tags.MARS) + 1; // +1 is the "including this"
    player.addProduction(Resources.MEGACREDITS, count, {log: true});
    return undefined;
  }
}

