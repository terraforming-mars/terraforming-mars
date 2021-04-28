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

export class FieldCappedCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FIELD_CAPPED_CITY,
      tags: [Tags.CITY, Tags.BUILDING, Tags.ENERGY],
      cost: 29,

      metadata: {
        cardNumber: 'X21',
        description: 'Increase your M€ production 2 steps, increase your energy production 1 step, gain 3 plants, and place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.energy(1);
          }).nbsp.city().br;
          b.plants(3);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public play(player: Player) {
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        player.plants += 3;
        player.addProduction(Resources.ENERGY, 1);
        player.addProduction(Resources.MEGACREDITS, 2);
        return undefined;
      },
    );
  }
}
