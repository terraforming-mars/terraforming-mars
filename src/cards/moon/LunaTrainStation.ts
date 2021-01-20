import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {TileType} from '../../TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {PlaceSpecialMoonTile} from '../../moon/PlaceSpecialMoonTile';

export class LunaTrainStation extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_TRAIN_STATION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 20,

      metadata: {
        description: 'Requires Logistic Rate to be 5 or higher. Spend 2 steel. ' +
        'Increase your MC production 4 steps. Place this tile on the Moon and raise Logistic Rate 1 step. ' +
        '2 ADDITIONAL VPs FOR EACH MINING TILE ADJACENT TO THIS TILE.',
        cardNumber: 'M15',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(2).br;
          b.production((pb) => pb.megacredits(4));
          b.tile(TileType.LUNA_TRAIN_STATION, true).moonLogisticsRate(1);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(), // (2, 1),
      },
    }, {
      reserveUnits: Units.of({steel: 2}),
    });
  }

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).logisticRate >= 5;
  }

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    player.addProduction(Resources.MEGACREDITS, 4, player.game);
    player.game.defer(new PlaceSpecialMoonTile(player, {
      tileType: TileType.LUNA_TRAIN_STATION,
      card: this.name,
    },
    'Select a space for Luna Train Station.'));
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }

  public getVictoryPoints(_player: Player, game: Game) {
    const moonData = MoonExpansion.moonData(game);
    const usedSpace = moonData.moon.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      return 2 * game.board.getAdjacentSpaces(usedSpace)
        .filter((s) => s.tile?.tileType === TileType.MOON_ROAD).length;
    }
    return 0;
  }
}
