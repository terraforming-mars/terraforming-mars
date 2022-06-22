import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {isSpecialTile, playerTileFn} from '../../boards/Board';

export class RareEarthElements extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RARE_EARTH_ELEMENTS,
      cost: 5,
      tags: [Tags.EARTH, Tags.MARS],

      metadata: {
        cardNumber: 'Pf06',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().specialTile();
        }),
        description: 'Increase your M€ production by 1 for every special tile you own on Mars.',
      },
    });
  }


  public play(player: Player) {
    const spaces = player.game.board.spaces
      .filter(playerTileFn(player))
      .filter(isSpecialTile);

    player.addProduction(Resources.MEGACREDITS, spaces.length, {log: true});
    return undefined;
  }
}

