import {IProjectCard} from '../IProjectCard';
import {ICard, IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Dirigibles implements IActionCard, IProjectCard, IResourceCard {
    public cost = 11;
    public tags = [Tags.VENUS];

    public name = CardName.DIRIGIBLES;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      const floaterCards = player.getResourceCards(ResourceType.FLOATER);
      if (floaterCards.length === 1) {
        this.resourceCount++;
        LogHelper.logAddResource(player, floaterCards[0]);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 floater',
        'Add floater',
        floaterCards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: '222',
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 Floater to ANY card', (eb) => {
          eb.empty().startAction.floaters(1).asterix();
        }).br;
        b.effect('When playing a Venus tag, Floaters here may be used as payment, and are worth 3MC each.', (eb) => {
          eb.venus(1).played.startEffect.floaters(1).equals().megacredits(3);
        });
      }),
    }
}
