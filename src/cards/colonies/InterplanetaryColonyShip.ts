import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class InterplanetaryColonyShip implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.INTERPLANETARY_COLONY_SHIP;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.hasAvailableColonyTileToBuildOn();
    }

    public play(player: Player) {
      player.game.defer(new BuildColony(player, false, 'Select colony for Interplanetary Colony Ship'));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C17',
      renderData: CardRenderer.builder((b) => b.colonies(1)),
      description: 'Place a colony.',
    }
}
