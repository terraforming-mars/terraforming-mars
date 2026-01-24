import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {isPlanetaryTag, PlanetaryTag} from '../../pathfinders/PathfindersData';
import {PathfindersExpansion, TRACKS} from '../../pathfinders/PathfindersExpansion';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {PathfindersData} from '../../pathfinders/PathfindersData';

export class EconomicHelp extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ECONOMIC_HELP,
      cost: 9,

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'Pf42',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3').or().text('2')
            .tag(Tag.VENUS).or(Size.SMALL)
            .tag(Tag.EARTH).or(Size.SMALL).br;
          b.tag(Tag.MARS).or(Size.SMALL)
            .tag(Tag.JOVIAN).or(Size.SMALL)
            .tag(Tag.MOON).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Raise the lowest non-completed planetary influence track 3 steps. When tied, raise all lowest tracks 2 steps. ' +
         'Increase your M€ production 1 step',
      },
    });
  }

  private trackOffset(tag: PlanetaryTag, data: PathfindersData): number {
    const value = data[tag];
    const maxValue = TRACKS[tag].spaces.length - 1;
    return maxValue === value ? -1 : value;
  }

  public override bespokePlay(player: IPlayer) {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }
    const tags = player.game.tags.filter(isPlanetaryTag);
    const values = tags.map((tag) => this.trackOffset(tag, data));

    // Filter any maximized track.
    // Filter out -1.
    const lowest = Math.min(...(values.filter((v) => v >= 0)));
    const count = values.filter((v) => v === lowest).length;
    const increment = (count === 1) ? 3 : 2;
    if (data.earth === lowest) PathfindersExpansion.raiseTrack(Tag.EARTH, player, increment);
    if (data.jovian === lowest) PathfindersExpansion.raiseTrack(Tag.JOVIAN, player, increment);
    if (data.mars === lowest) PathfindersExpansion.raiseTrack(Tag.MARS, player, increment);
    if (data.moon === lowest && player.game.gameOptions.moonExpansion === true) PathfindersExpansion.raiseTrack(Tag.MOON, player, increment);
    if (data.venus === lowest && player.game.gameOptions.venusNextExtension === true) PathfindersExpansion.raiseTrack(Tag.VENUS, player, increment);
    return undefined;
  }
}
