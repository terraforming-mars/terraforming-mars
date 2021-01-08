import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EarthElevator implements IProjectCard {
    public cost = 43;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.EARTH_ELEVATOR;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, 3);
      return undefined;
    }
    public getVictoryPoints() {
      return 4;
    }
    public metadata: CardMetadata = {
      description: 'Increase your titanium production 3 steps.',
      cardNumber: 'C08',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.titanium(3));
      }),
      victoryPoints: 4,
    };
}
