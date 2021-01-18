import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class CuttingEdgeTechnology implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE];
    public name = CardName.CUTTING_EDGE_TECHNOLOGY;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      if (card.metadata.requirements !== undefined) return 2;
      return 0;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X17',
      renderData: CardRenderer.builder((b) => {
        b.effect('When playing a card with a requirement, you pay 2 MC less for it.', (eb) => {
          eb.cards(1).secondaryTag(AltSecondaryTag.REQ).startEffect.megacredits(-2);
        });
      }),
      victoryPoints: 1,
    };
}
