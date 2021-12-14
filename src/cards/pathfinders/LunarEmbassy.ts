import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {played} from '../Options';

export class LunarEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUNAR_EMBASSY,
      tags: [Tags.EARTH, Tags.MARS, Tags.CITY, Tags.SPACE],
      cost: 28,
      victoryPoints: 2,

      metadata: {
        cardNumber: 'Pf16',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3))
            .production((pb) => pb.plants(1).slash().earth(2, {played}))
            .br
            .cards(1).city().asterix().br;
        }),
        description: 'Increase your M€ production 2 steps, and plant production 1 step for every 2 earth tags (including this.) ' +
          'Draw a card. Place a city tile ON THE RESERVED AREA.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    player.addProduction(Resources.PLANTS, Math.floor((1 + player.getTagCount(Tags.EARTH)) / 2), {log: true});
    player.drawCard();
    player.game.addCityTile(player, SpaceName.LUNAR_EMBASSY, SpaceType.COLONY);
    return undefined;
  }
}
