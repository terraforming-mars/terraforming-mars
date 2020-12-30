import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Tardigrades implements IProjectCard, IResourceCard {
    public cost = 4;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags = [Tags.MICROBE];
    public name = CardName.TARDIGRADES;
    public cardType = CardType.ACTIVE;

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 4);
    }
    public play() {
      return undefined;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public metadata: CardMetadata = {
      cardNumber: '049',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1);
          eb.description('Action: Add 1 Microbe to this card.');
        }).br;
        b.text('1 VP per 4 Microbes on this card.', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 4),
    }
}
