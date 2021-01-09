import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Penguins implements IActionCard, IProjectCard, IResourceCard {
    public name = CardName.PENGUINS;
    public cost = 7;
    public tags = [Tags.ANIMAL];
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OCEANS, 8);
    }

    public play() {
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }

    public metadata: CardMetadata = {
      cardNumber: '212',
      requirements: CardRequirements.builder((b) => b.oceans(8)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 Animal to this card.', (eb) => {
          eb.empty().startAction.animals(1);
        }).br;
        b.vpText('1 VP for each animal on this card.');
      }),
      description: 'Requires 8 oceans.',
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    }
}
