import {CorporationCard} from '@/server/cards/corporation/CorporationCard';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Phase} from '@/common/Phase';
import {Resource} from '@/common/Resource';

export class Aerotech extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.AEROTECH,
      tags: [Tag.SPACE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'R59',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br;
          b.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('During each round\'s research phase, gain 1 titanium for each card you do not buy.', (eb) => {
              eb.cards(1).startEffect.titanium(1).asterix();
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public static onDrawCards(player: IPlayer, _cards: ReadonlyArray<IProjectCard>, discards: ReadonlyArray<IProjectCard>) {
    if (player.game.phase === Phase.RESEARCH && player.tableau.has(CardName.AEROTECH)) {
      player.stock.add(Resource.TITANIUM, discards.length, {log: true});
    }

    return undefined;
  }
}
