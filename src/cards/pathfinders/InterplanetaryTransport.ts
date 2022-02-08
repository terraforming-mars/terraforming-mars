import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {SpaceType} from '../../common/boards/SpaceType';
import {Resources} from '../../common/Resources';
import {TileType} from '../../common/TileType';
import {all} from '../Options';

export class InterplanetaryTransport extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INTERPLANETARY_TRANSPORT,
      cost: 15,
      tags: [Tags.EARTH, Tags.JOVIAN, Tags.SPACE],
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf43',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().city({all, secondaryTag: Tags.SPACE}).asterix;
        }),
        description: 'Increase your M€ production 1 step for every offworld city tile.',
      },
    });
  }

  public play(player: Player) {
    const offWorldCities = player.game.board.getSpaces(SpaceType.COLONY, player).filter((space) => space.tile?.tileType === TileType.CITY);
    player.addProduction(Resources.MEGACREDITS, offWorldCities.length, {log: true});
    return undefined;
  }
}

