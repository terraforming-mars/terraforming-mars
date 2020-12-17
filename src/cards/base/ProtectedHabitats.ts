import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ProtectedHabitats implements IProjectCard {
    public cardType = CardType.ACTIVE;
    public cost = 5;
    public tags = [];
    public name = CardName.PROTECTED_HABITATS;

    public play(_player: Player, _game: Game) {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '173',
      renderData: CardRenderer.builder((b) => {
        b.text('Opponents may not remove your', CardRenderItemSize.SMALL, true).br;
        b.plants(1).animals(1).microbes(1);
      }),
    }
}
