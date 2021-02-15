import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class UndergroundCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: -2, steel: 2}),

      metadata: {
        cardNumber: '032',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().steel(2);
          }).nbsp.city();
        }),
        description: 'Place a City tile. Decrease your Energy production 2 steps and increase your steel production 2 steps.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 2 && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (foundSpace: ISpace) => {
      player.game.addCityTile(player, foundSpace.id);
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.STEEL, 2);
      return undefined;
    });
  }
}
