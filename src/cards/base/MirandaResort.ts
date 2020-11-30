
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MirandaResort implements IProjectCard {
    public cost = 12;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.MIRANDA_RESORT;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH));
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '051',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(1).slash().earth();
        });
      }),
      description: 'Increase your MC production 1 step for each Earth tag you have.',
      victoryPoints: 1,
    };
}
