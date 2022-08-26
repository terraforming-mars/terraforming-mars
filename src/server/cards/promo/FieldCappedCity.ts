import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class FieldCappedCity extends Card implements IProjectCard {
  public migrated = true;
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FIELD_CAPPED_CITY,
      tags: [Tag.CITY, Tag.BUILDING, Tag.ENERGY],
      cost: 29,
      productionBox: Units.of({energy: 1, megacredits: 2}),
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

  public override canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public play(player: Player) {
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        player.plants += 3;
        return undefined;
      },
    );
  }
}
