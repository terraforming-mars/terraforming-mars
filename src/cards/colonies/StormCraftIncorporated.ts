import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {ICard, IActionCard, IResourceCard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class StormCraftIncorporated implements IActionCard, CorporationCard, IResourceCard {
    public name = CardName.STORMCRAFT_INCORPORATED;
    public tags = [Tags.JOVIAN];
    public startingMegaCredits: number = 48;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

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
        return undefined;
      }

      return new SelectCard(
          'Select card to add 1 floater',
          'Add floater',
          floaterCards,
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], 1);
            return undefined;
          },
      );
    }
}
