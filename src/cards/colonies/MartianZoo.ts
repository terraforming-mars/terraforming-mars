import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {IResourceCard} from '../ICard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MartianZoo implements IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.ANIMAL, Tags.BUILDING];
    public name = CardName.MARTIAN_ZOO;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.EARTH) !== -1) {
        player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.EARTH).length);
      }
    }

    public canPlay(_player: Player, game: Game): boolean {
      return game.getCitiesInPlay() >= 2;
    }

    public canAct(): boolean {
      return this.resourceCount > 0;
    }

    public action(player: Player, _game: Game) {
      player.megaCredits += this.resourceCount;
      return undefined;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C24',
      requirements: CardRequirements.builder((b) => b.cities(2).any()),
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play an Earth tag, place an animal here.', (eb) => {
          eb.earth().played.startEffect.animals(1);
        }).br;
        b.action('Gain 1MC per animal here.', (eb) => {
          eb.empty().startAction.megacredits(1).slash().animals(1);
        });
      }),
      description: {
        text: 'Requires 2 city tiles in play.',
        align: 'left',
      },
      victoryPoints: 1,
    }
}
