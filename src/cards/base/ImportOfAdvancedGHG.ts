import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ImportOfAdvancedGHG implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 9;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.IMPORT_OF_ADVANCED_GHG;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '167',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.heat(2))),
      description: 'Increase your heat production 2 steps.',
    }
}
