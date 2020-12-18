import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Game} from '../../Game';
import {IResourceCard} from '../ICard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class RedSpotObservatory implements IProjectCard, IResourceCard {
    public cost = 17;
    public tags = [Tags.JOVIAN, Tags.SCIENCE];
    public name = CardName.RED_SPOT_OBSERVATORY;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canAct(): boolean {
      return true;
    }

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 3;
    }

    public action(player: Player, game: Game) {
      if (this.resourceCount < 1) {
        this.resourceCount++;
        return undefined;
      }

      const opts: Array<SelectOption> = [];

      const addResource = new SelectOption('Add 1 floater on this card', 'Add floater', () => this.addResource());
      const spendResource = new SelectOption('Remove 1 floater on this card to draw a card', 'Remove floater', () => this.spendResource(player, game));

      opts.push(spendResource);
      opts.push(addResource);

      return new OrOptions(...opts);
    }

    private addResource() {
      this.resourceCount++;
      return undefined;
    }

    private spendResource(player: Player, game: Game) {
      this.resourceCount--;
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }

    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }

    public getVictoryPoints(): number {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C32',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().arrow().floaters(1).or();
          eb.floaters(1).startAction.cards(1);
          eb.description('Action: Add 1 floater to this card, or spend 1 floater here to draw a card.');
        }).br;
        b.cards(2);
      }),
      description: {
        text: 'Requires 3 Science tags. Draw 2 cards.',
        align: 'left',
      },
      victoryPoints: 2,
    }
}
