import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';


export class GreatEscarpmentConsortium implements IProjectCard {
    public cost = 6;
    public tags = [];
    public name = CardName.GREAT_ESCARPMENT_CONSORTIUM;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.STEEL) >= 1;
    }
    public play(player: Player, game: Game) {
      game.defer(new DecreaseAnyProduction(player, game, Resources.STEEL, 1));
      player.addProduction(Resources.STEEL);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '061',
      requirements: CardRequirements.builder((b) => b.production(Resources.STEEL)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().steel(-1).any.br;
          pb.plus().steel(1);
        });
      }),
      description: 'Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.',
    };
}
