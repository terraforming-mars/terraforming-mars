import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ISpace} from '../../ISpace';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {Board} from '../../Board';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Pets implements IProjectCard, IResourceCard {
    public cost = 10;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public tags = [Tags.EARTH, Tags.ANIMAL];
    public cardType = CardType.ACTIVE;
    public name = CardName.PETS;

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public onTilePlaced(player: Player, space: ISpace) {
      if (Board.isCitySpace(space)) {
        player.addResourceTo(this);
      }
    }
    public play(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '172',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.city(CardRenderItemSize.SMALL).any.startEffect.animals(1);
          eb.description('Effect: When any City tile is placed, add an Animal to this card.');
        }).br;
        b.animals(1).br;
        b.text('Animals may not be removed from this card', CardRenderItemSize.SMALL, true).br;
        b.text('1 VP per 2 Animals here.', CardRenderItemSize.TINY, true);
      }),
      description: {text: 'Add 1 Animal to this card.', align: 'left'},
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
    }
}
