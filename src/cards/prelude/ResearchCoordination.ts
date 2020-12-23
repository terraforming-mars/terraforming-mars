import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ResearchCoordination implements IProjectCard {
    public cost = 4;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.WILDCARD];
    public name = CardName.RESEARCH_COORDINATION;

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'P40',
      renderData: CardRenderer.builder((b) => {
        b.text('After being played, when you perform an action, the wild tag counts as any tag of your choice.', CardRenderItemSize.SMALL, true);
      }),
    }
}
