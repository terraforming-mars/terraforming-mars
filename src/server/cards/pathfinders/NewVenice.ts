import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class NewVenice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NEW_VENICE,
      tags: [Tag.MARS, Tag.ENERGY, Tag.BUILDING, Tag.CITY],
      cost: 21,

      behavior: {
        production: {energy: 1, megacredits: 2},
      },

      requirements: CardRequirements.builder((b) => b.oceans(3)),
      metadata: {
        cardNumber: 'Pf3',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2).br;
          b.production((pb) => {
            pb.energy(1).megacredits(2);
          }).nbsp.tile(TileType.OCEAN_CITY, false, true);
        }),
        description: 'Requires 3 ocean tiles. Lose 2 plants. Increase your energy production 1 step and your M€ production 2 steps. ' +
            'Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.',
      },
    });
  }

  // TODO(kberg): use reserveUnits for plants.
  public override bespokeCanPlay(player: Player): boolean {
    return player.plants >= 2;
  }

  public override bespokePlay(player: Player) {
    player.plants -= 2;

    return new SelectSpace(
      'Select space for New Venice',
      player.game.board.getOceanSpaces({upgradedOceans: false}),
      (space: ISpace) => {
        const tile = {
          tileType: TileType.OCEAN_CITY,
          card: this.name,
          covers: space.tile,
        };
        player.game.addTile(player, space.spaceType, space, tile);
        return undefined;
      },
    );
  }
}
