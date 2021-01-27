import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
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

    public play(player: Player) {
      if (player.game.turmoil) {
        player.game.turmoil.addInfluenceBonus(player);
      }
      return undefined;
    }

    public initialActionText: string = 'Place 2 delegates in one party';
    public initialAction(player: Player) {
      if (player.game.turmoil) {
        const title = 'Incite first action - Select where to send two delegates';
        player.game.defer(new SendDelegateToArea(player, title, 2, undefined, undefined, false));
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
          ce.effect(undefined, (eb) => {
            eb.startEffect.influence(1);
          });
          ce.vSpace(CardRenderItemSize.SMALL);
          ce.effect('You have +1 influence. When you send a delegate using the lobbying action, you pay 2 MC less for it.', (eb) => {
            eb.delegates(1).startEffect.megacredits(-2);
          });
        });
      }),
    }
}
