import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {CardRenderer} from '../render/CardRenderer';

export class OlympusConference extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.OLYMPUS_CONFERENCE,
      tags: [Tag.SCIENCE, Tag.EARTH, Tag.BUILDING],
      cost: 10,
      resourceType: CardResource.SCIENCE,
      victoryPoints: 1,

      metadata: {
        cardNumber: '185',
        renderData: CardRenderer.builder((b) => {
          b.tag(Tag.SCIENCE).colon().resource(CardResource.SCIENCE).br;
          b.or().br;
          b.minus().resource(CardResource.SCIENCE).plus().cards(1);
        }),
        description: 'When you play a science tag, including this, either add a science resource to this card, or remove a science resource from this card to draw a card.',
      },
    });
  }


  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    this.onScienceTagAdded(player, scienceTags);
  }
  public onColonyAddedToLeavitt(player: IPlayer) {
    this.onScienceTagAdded(player, 1);
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    for (let i = 0; i < count; i++) {
      player.defer(() => {
        // Can't remove a resource
        if (this.resourceCount === 0) {
          player.addResourceTo(this, 1);
          return undefined;
        }
        const options = new OrOptions(
          new SelectOption('Remove a science resource from this card to draw a card', 'Remove resource').andThen(() => {
            player.removeResourceFrom(this);
            player.drawCard();
            return undefined;
          }),
          new SelectOption('Add a science resource to this card', 'Add resource').andThen(() => {
            player.addResourceTo(this, 1);
            return undefined;
          }),
        );
        options.title = 'Select an option for Olympus Conference';
        return options;
      },
      Priority.SUPERPOWER); // Unshift that deferred action
    }
    return undefined;
  }
}
