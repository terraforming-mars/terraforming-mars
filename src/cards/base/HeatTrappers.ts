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

export class HeatTrappers implements IProjectCard {
    public cost = 6;
    public tags = [Tags.ENERGY, Tags.BUILDING];
    public name = CardName.HEAT_TRAPPERS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(_player: Player, game: Game): boolean {
      return game.someoneHasResourceProduction(Resources.HEAT, 2);
    }

    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.HEAT, 2));
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: '178',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().heat(2).any.br;
          pb.plus().energy(1);
        });
      }),
      description: 'Decrease any heat production 2 steps and increase your Energy production 1 step.',
      victoryPoints: -1,
    };
}
