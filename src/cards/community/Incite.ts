import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Incite implements CorporationCard {
    public name = CardName.INCITE;
    public tags = [Tags.SCIENCE];
    public startingMegaCredits: number = 32;
    public cardType = CardType.CORPORATION;

    public play(player: Player, game: Game) {
      if (game.turmoil) game.turmoil.addInfluenceBonus(player);
      return undefined;
    }

    public initialActionText: string = 'Place 2 delegates in one party';
    public initialAction(player: Player, game: Game) {
      if (game.turmoil) {
        const title = 'Incite first action - Select where to send two delegates';
        game.defer(new SendDelegateToArea(player, game, title, 2, undefined, undefined, false));
      }

      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R37',
      description: 'You start with 32 MC. As your first action, place two delegates in one party.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.megacredits(32).nbsp.delegates(2);
        b.corpBox('effect', (ce) => {
          ce.vSpace(CardRenderItemSize.LARGE);
          ce.effectBox((eb) => {
            eb.startEffect.influence(1).description(undefined);
          });
          ce.vSpace(CardRenderItemSize.SMALL);
          ce.effectBox((eb) => {
            eb.delegates(1).startEffect.megacredits(-2);
            eb.description('Effect: You have +1 influence. When you send a delegate using the lobbying action, you pay 2 MC less for it.');
          });
        });
      }),
    }
}
