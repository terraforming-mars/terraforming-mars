import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class VenusianAnimals implements IProjectCard, IResourceCard {
    public cost = 15;
    public tags = [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE];
    public name = CardName.VENUSIAN_ANIMALS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.VENUS, 18);
    }
    public play() {
      return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public metadata: CardMetadata = {
      cardNumber: '259',
      requirements: CardRequirements.builder((b) => b.venus(18)),
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play a Science tag, including this, add 1 Animal to this card.', (eb)=> {
          eb.science().played.startEffect.animals(1);
        }).br;
        b.vpText('1 VP per Animal on this card.');
      }),
      description: 'Requires Venus 18%',
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    }
}
