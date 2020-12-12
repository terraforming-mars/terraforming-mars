import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class IndustrialMicrobes implements IProjectCard {
    public cost = 12;
    public tags = [Tags.MICROBES, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.INDUSTRIAL_MICROBES;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.STEEL);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '158',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1).steel(1));
      }),
      description: 'Increase your Energy production and your steel production 1 step each.',
    }
}

