import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Priority, SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class OlympusConference extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OLYMPUS_CONFERENCE,
      tags: [Tag.SCIENCE, Tag.EARTH, Tag.BUILDING],
      cost: 10,
      resourceType: CardResource.SCIENCE,
      victoryPoints: 1,

      metadata: {
        cardNumber: '185',
        renderData: CardRenderer.builder((b) => {
          b.science(1, {played}).colon().science().br;
          b.or().br;
          b.minus().science().plus().cards(1);
        }),
        description: 'When you play a Science tag, including this, either add a science resource to this card, or remove a science resource from this card to draw a card.',
      },
    });
  }


  public onCardPlayed(player: Player, card: IProjectCard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    for (let i = 0; i < scienceTags; i++) {
      player.game.defer(new SimpleDeferredAction(
        player,
        () => {
          // Can't remove a resource
          if (this.resourceCount === 0) {
            player.addResourceTo(this, 1);
            return undefined;
          }
          const options = new OrOptions(
            new SelectOption('Remove a science resource from this card to draw a card', 'Remove resource', () => {
              player.removeResourceFrom(this);
              player.drawCard();
              return undefined;
            }),
            new SelectOption('Add a science resource to this card', 'Add resource', () => {
              player.addResourceTo(this, 1);
              return undefined;
            }),
          );
          options.title = 'Select an option for Olympus Conference';
          return options;
        },
      ), Priority.SUPERPOWER); // Unshift that deferred action
    }
    return undefined;
  }
}
