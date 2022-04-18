import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {IResourceCard} from '../ICard';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class OlympusConference extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OLYMPUS_CONFERENCE,
      tags: [Tags.SCIENCE, Tags.EARTH, Tags.BUILDING],
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
        description: 'When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.',
      },
    });
  }

  public override resourceCount: number = 0;

  public onCardPlayed(player: Player, card: IProjectCard) {
    const scienceTags = player.cardTagCount(card, Tags.SCIENCE);
    for (let i = 0; i < scienceTags; i++) {
      player.game.defer(new DeferredAction(
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
      ), -1); // Unshift that deferred action
    }
    return undefined;
  }
  public play() {
    return undefined;
  }
}
