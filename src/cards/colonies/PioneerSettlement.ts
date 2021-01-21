import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PioneerSettlement implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SPACE];
    public name = CardName.PIONEER_SETTLEMENT;
    public cardType = CardType.AUTOMATED;
    public warning?: string;

    public canPlay(player: Player): boolean {
      if (player.hasAvailableColonyTileToBuildOn() === false) {
        return false;
      }

      let lunaIsAvailable = false;
      let coloniesCount: number = 0;
      const hasOneColonyMax = player.game.colonies.every((colony) => {
        if (colony.name === ColonyName.LUNA &&
            colony.isColonyFull() === false &&
            colony.colonies.includes(player.id) === false) {
          lunaIsAvailable = true;
        }
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
        if (coloniesCount > 1) {
          return false;
        }
        return true;
      });

      if (hasOneColonyMax === false) {
        return false;
      }

      if (player.getProduction(Resources.MEGACREDITS) <= -4) {
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
      player.game.defer(new BuildColony(player, false, 'Select colony for Pioneer Settlement', openColonies));
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C29',
      requirements: CardRequirements.builder((b) => b.colonies(1).max()),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(-2));
        b.nbsp.colonies(1);
      }),
      description: 'Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.',
      victoryPoints: 2,
    }
}
