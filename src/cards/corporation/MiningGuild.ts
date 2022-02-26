import {Card} from '../Card';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {ICorporationCard} from './ICorporationCard';
import {Phase} from '../../common/Phase';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {GainProduction} from '../../deferredActions/GainProduction';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {BoardType} from '../../boards/BoardType';
import {digit} from '../Options';

export class MiningGuild extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MINING_GUILD,
      tags: [Tags.BUILDING, Tags.BUILDING],
      startingMegaCredits: 30,
      productionBox: Units.of({steel: 1}),

      metadata: {
        cardNumber: 'R24',
        description: 'You start with 30 M€, 5 steel and 1 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(30).nbsp.steel(5, {digit}).nbsp.production((pb) => pb.steel(1));
          b.corpBox('effect', (ce) => {
            ce.effect('Each time you get any steel or titanium as a placement bonus on the map, increase your steel production 1 step.', (eb) => {
              eb.steel(1).asterix().slash().titanium(1).asterix();
              eb.startEffect.production((pb) => pb.steel(1));
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
    // Nerfing on The Moon.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.id !== activePlayer.id || cardOwner.game.phase === Phase.SOLAR) {
      return;
    }
    // Don't grant a bonus if the card is overplaced (like Ares Ocean City)
    if (space?.tile?.covers !== undefined) {
      return;
    }
    if (space.bonus.some((bonus) => bonus === SpaceBonus.STEEL || bonus === SpaceBonus.TITANIUM)) {
      cardOwner.game.defer(new GainProduction(cardOwner, Resources.STEEL));
    }
  }

  public play(player: Player) {
    player.steel = 5;
    player.addProduction(Resources.STEEL, 1);
    return undefined;
  }
}
