import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';
import {Tags} from '../../common/cards/Tags';
import {Size} from '../render/Size';
import {played} from '../Options';

export class EconomicHelp extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ECONOMIC_HELP,
      cost: 9,

      metadata: {
        cardNumber: 'Pf42',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3').or().text('2')
            .venus(1, {played}).or(Size.SMALL)
            .earth(1, {played}).or(Size.SMALL).br;
          b.mars(1, {played}).or(Size.SMALL)
            .jovian({amount: 1, played}).or(Size.SMALL)
            .moon(1, {played}).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Raise the lowest planetary influence track by 3. When tied, raise all lowest tracks by 2. ' +
         'Increase your M€ production 1 step',
      },
    });
  }

  public play(player: Player) {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }
    const values = [data.earth, data.jovian, data.mars];
    if (player.game.gameOptions.moonExpansion === true) values.push(data.moon);
    if (player.game.gameOptions.venusNextExtension === true) values.push(data.venus);
    // Filter out -1.
    const lowest = Math.min(...(values.filter((v) => v >= 0)));
    const count = values.filter((v) => v === lowest).length;
    const increment = (count === 1) ? 3 : 2;
    if (data.earth === lowest) PathfindersExpansion.raiseTrack(Tags.EARTH, player, increment);
    if (data.jovian === lowest) PathfindersExpansion.raiseTrack(Tags.JOVIAN, player, increment);
    if (data.mars === lowest) PathfindersExpansion.raiseTrack(Tags.MARS, player, increment);
    if (data.moon === lowest && player.game.gameOptions.moonExpansion === true) PathfindersExpansion.raiseTrack(Tags.MOON, player, increment);
    if (data.venus === lowest && player.game.gameOptions.venusNextExtension === true) PathfindersExpansion.raiseTrack(Tags.VENUS, player, increment);
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
}
