import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Livestock implements IActionCard, IProjectCard, IResourceCard {
    public cost = 13;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public tags = [Tags.ANIMAL];
    public name = CardName.LIVESTOCK;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 9) && player.getProduction(Resources.PLANTS) >= 1;
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, -1);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '184',
      requirements: CardRequirements.builder((b) => b.oxygen(9)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 Animal to this card.', (eb) => {
          eb.empty().startAction.animals(1);
        }).br;
        b.production((pb) => {
          pb.minus().plants(1).nbsp.plus().megacredits(2);
        }).br;
        b.text('1 VP for each Animal on this card.', CardRenderItemSize.TINY, true);
      }),
      description: {
        text: 'Requires 9% oxygen. Decrease your Plant production 1 step and increase your MC production 2 steps',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
    }
}

