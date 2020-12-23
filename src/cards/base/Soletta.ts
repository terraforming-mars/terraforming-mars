import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Soletta implements IProjectCard {
    public cost = 35;
    public tags = [Tags.SPACE];
    public cardType = CardType.AUTOMATED;
    public name = CardName.SOLETTA;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT, 7);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '203',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.heat(7));
      }),
      description: 'Increase your heat production 7 steps.',
    }
}
