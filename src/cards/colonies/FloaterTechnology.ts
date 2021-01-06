import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterTechnology implements IProjectCard {
    public cost = 7;
    public tags = [Tags.SCIENCE];
    public name = CardName.FLOATER_TECHNOLOGY;
    public cardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
      return player.getResourceCards(ResourceType.FLOATER).length > 0;
    }

    public action(player: Player, game: Game) {
      const floaterCards = player.getResourceCards(ResourceType.FLOATER);

      if (floaterCards.length) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, {count: 1}));
      }

      return undefined;
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C12',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.floaters(1).asterix();
          eb.description('Action: Add 1 floater to ANOTHER card.');
        });
      }),
    }
}

