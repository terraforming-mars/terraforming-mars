import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EnergyTapping implements IProjectCard {
    public cost = 3;
    public tags = [Tags.ENERGY];
    public name = CardName.ENERGY_TAPPING;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY);
      game.defer(new DecreaseAnyProduction(player, game, Resources.ENERGY, 1));
      return undefined;
    }

    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: '201',
      description: 'Decrease any Energy production 1 step and increase your own 1 step.',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().energy(1).any;
        });
      }),
      victoryPoints: -1,
    };
}
