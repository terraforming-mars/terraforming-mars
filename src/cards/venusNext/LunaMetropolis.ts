import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class LunaMetropolis extends Card {
  constructor() {
    super({
      name: CardName.LUNA_METROPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.SPACE, Tags.EARTH],
      cost: 21,

      victoryPoints: 2,

      metadata: {
        cardNumber: '236',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().earth(1, {played})).br;
          b.city().asterix();
        }),
        description: 'Increase your M€ production 1 step for each Earth tag you have, including this. Place a City tile on the RESERVED AREA',
      },
    });
  };
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1, {log: true});
    player.game.addCityTile(player, SpaceName.LUNA_METROPOLIS, SpaceType.COLONY);
    return undefined;
  }
}
