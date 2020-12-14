import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TitaniumMine implements IProjectCard {
    public cost = 7;
    public tags = [Tags.STEEL];
    public name = CardName.TITANIUM_MINE;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '144',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.titanium(1));
      }),
      description: 'Increase your titanium production 1 step.',
    }
}
