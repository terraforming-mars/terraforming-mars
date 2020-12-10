import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MicroMills implements IProjectCard {
    public cost = 3;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.MICRO_MILLS;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '164',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.heat(1));
      }),
      description: 'Increase your heat production 1 step.',
    }
}

