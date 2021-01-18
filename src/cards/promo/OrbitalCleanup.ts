import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalCleanup implements IProjectCard {
    public name = CardName.ORBITAL_CLEANUP;
    public cost = 14;
    public tags = [Tags.EARTH, Tags.SPACE];
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -3;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      player.setResource(Resources.MEGACREDITS, player.getTagCount(Tags.SCIENCE));
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X08',
      renderData: CardRenderer.builder((b) => {
        b.action('Gain 1 MC per Science tag you have.', (eb) => {
          eb.empty().startAction.megacredits(1).slash().science().played;
        }).br;
        b.production((pb) => {
          pb.megacredits(-2);
        });
      }),
      description: 'Decrease your MC production 2 steps.',
      victoryPoints: 2,
    }
}
