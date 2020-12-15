import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class OlympusConference implements IProjectCard, IResourceCard {
    public cost = 10;
    public tags = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.SCIENCE;
    public resourceCount: number = 0;
    public name = CardName.OLYMPUS_CONFERENCE;

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
      const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
      for (let i = 0; i < scienceTags; i++) {
        game.defer(new DeferredAction(
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
                player.cardsInHand.push(game.dealer.dealCard());
                return undefined;
              }),
              new SelectOption('Add a science resource to this card', 'Add resource', () => {
                this.resourceCount++;
                return undefined;
              }),
            );
          },
        ), true); // Unshift that deferred action
      }
      return undefined;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '185',
      renderData: CardRenderer.builder((b) => {
        b.science().played.colon().science().br;
        b.or().br;
        b.minus().science().plus().cards(1);
      }),
      description: 'When you play a Science tag, including this, either add a Science resource to this card, or remove a Science resource from this card to draw a card.',
      victoryPoints: 1,
    }
}
