import {Card} from '../Card';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {CardType} from './../CardType';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class NewVenice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NEW_VENICE,
      tags: [Tags.MICROBE, Tags.ENERGY, Tags.BUILDING, Tags.CITY],
      cost: 21,
      productionBox: Units.of({energy: 1, megacredits: 2}),

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

  public override canPlay(player: Player): boolean {
    return super.canPlay(player) && (player.plants >= 2);
  }

  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.plants -= 2;

    return new SelectSpace(
      'Select space for New Venice',
      player.game.board.getOceansTiles(false),
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
