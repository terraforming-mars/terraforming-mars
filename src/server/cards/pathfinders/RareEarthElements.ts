import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';
import {isSpecialTile, playerTileFn} from '../../boards/Board';

export class RareEarthElements extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RARE_EARTH_ELEMENTS,
      cost: 5,
      tags: [Tag.EARTH, Tag.MARS],

      metadata: {
        cardNumber: 'Pf06',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().specialTile();
        }),
        description: 'Increase your M€ production by 1 for every special tile you own on Mars.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const spaces = player.game.board.spaces
      .filter(playerTileFn(player))
      .filter(isSpecialTile);

    player.production.add(Resources.MEGACREDITS, spaces.length, {log: true});
    return undefined;
  }
}

