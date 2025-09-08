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
import {ICard} from '../ICard';

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


  public onCardPlayed(player: IPlayer, card: ICard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    this.onScienceTagAdded(player, scienceTags);
  }
  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.SCIENCE) {
      this.onScienceTagAdded(player, 1);
    }
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    for (let i = 0; i < count; i++) {
      player.defer(() => {
        // Can't remove a resource
        if (this.resourceCount === 0) {
          player.addResourceTo(this, {log: true});
          return undefined;
        }
        return new OrOptions(
          new SelectOption('Remove a science resource from this card to draw a card', 'Remove resource').andThen(() => {
            player.removeResourceFrom(this);
            player.drawCard();
            player.game.log('${0} removed a resource from ${1} to draw a card', (b) => b.player(player).card(this));
            return undefined;
          }),
          new SelectOption('Add a science resource to this card', 'Add resource').andThen(() => {
            player.addResourceTo(this, {log: true});
            return undefined;
          }),
        ).setTitle('Select an option for Olympus Conference');
      },
      Priority.OLYMPUS_CONFERENCE); // Unshift that deferred action
    }
    return undefined;
  }
}
