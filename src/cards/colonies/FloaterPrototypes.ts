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

export class FloaterPrototypes implements IProjectCard {
    public cost = 2;
    public tags = [Tags.SCIENCE];
    public name = CardName.FLOATER_PROTOTYPES;
    public cardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C11',
      renderData: CardRenderer.builder((b) => b.floaters(2).asterix()),
      description: 'Add two floaters to ANOTHER card.',
    }
}

