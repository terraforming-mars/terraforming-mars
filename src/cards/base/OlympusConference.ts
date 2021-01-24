import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';

export class OlympusConference extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OLYMPUS_CONFERENCE,
      tags: [Tags.SCIENCE, Tags.EARTH, Tags.BUILDING],
      cost: 10,
      resourceType: ResourceType.SCIENCE,

      metadata: {
        cardNumber: '185',
        renderData: CardRenderer.builder((b) => {
          b.science().played.colon().science().br;
          b.or().br;
          b.minus().science().plus().cards(1);
        }),
        description: 'When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.',
        victoryPoints: 1,
      },
    });
  }

    public resourceCount: number = 0;

    public onCardPlayed(player: Player, card: IProjectCard) {
      const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
      for (let i = 0; i < scienceTags; i++) {
        player.game.defer(new DeferredAction(
          player,
          () => {
            // Can't remove a resource
            if (this.resourceCount === 0) {
              this.resourceCount++;
              return undefined;
            }
            return new OrOptions(
              new SelectOption('Remove a science resource from this card to draw a card', 'Remove resource', () => {
                player.removeResourceFrom(this);
                player.drawCard();
                return undefined;
              }),
              new SelectOption('Add a science resource to this card', 'Add resource', () => {
                this.resourceCount++;
                return undefined;
              }),
            );
          },
        ), -1); // Unshift that deferred action
      }
      return undefined;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
