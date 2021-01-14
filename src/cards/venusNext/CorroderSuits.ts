import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class CorroderSuits implements IProjectCard {
    public cost = 8;
    public tags = [Tags.VENUS];
    public name = CardName.CORRODER_SUITS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      const cards = CorroderSuits.getVenusResCards(player);

      if (cards.length === 0) return undefined;

      if (cards.length === 1) {
        player.addResourceTo(cards[0], 1);
        LogHelper.logAddResource(player, cards[0]);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 resource',
        'Add resource',
        CorroderSuits.getVenusResCards(player),
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      );
    }
    public static getVenusResCards(player: Player): ICard[] {
      let resourceCards = player.getResourceCards(ResourceType.FLOATER);
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
      return resourceCards.filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
    }
    public metadata: CardMetadata = {
      cardNumber: '219',
      description: 'Increase your MC production 2 steps. Add 1 resource to ANY Venus CARD.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.megacredits(2);
        }).wild(1).secondaryTag(Tags.VENUS);
      }),
    }
}
