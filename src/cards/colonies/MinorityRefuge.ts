import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MinorityRefuge implements IProjectCard {
    public cost = 5;
    public tags = [Tags.SPACE];
    public name = CardName.MINORITY_REFUGE;
    public cardType = CardType.AUTOMATED;
    public warning?: string;

    public canPlay(player: Player): boolean {
      if (player.hasAvailableColonyTileToBuildOn() === false) {
        return false;
      }

      if (player.getProduction(Resources.MEGACREDITS) <= -4) {
        const lunaIsAvailable = player.game.colonies.some((colony) =>
          colony.name === ColonyName.LUNA &&
          colony.isColonyFull() === false &&
          colony.colonies.includes(player.id) === false);

        if (lunaIsAvailable === false) {
          return false;
        }
        this.warning = 'You will only be able to build the colony on Luna.';
      }

      return true;
    }

    public play(player: Player) {
      const openColonies = player.getProduction(Resources.MEGACREDITS) <= -4 ?
        player.game.colonies.filter((colony) => colony.name === ColonyName.LUNA) :
        undefined;
      player.game.defer(new BuildColony(player, false, 'Select colony for Minority Refuge', openColonies));
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C26',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(-2)).colonies(1);
      }),
      description: 'Decrease your MC production 2 steps. Place a colony.',
    }
}
