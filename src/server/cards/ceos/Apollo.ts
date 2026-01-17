import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CeoCard} from '@/server/cards/ceos/CeoCard';

import {MoonExpansion} from '@/server/moon/MoonExpansion';
import {Resource} from '@/common/Resource';
import {all} from '@/server/cards/Options';


export class Apollo extends CeoCard {
  constructor() {
    super({
      name: CardName.APOLLO,
      metadata: {
        cardNumber: 'L35',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.moonHabitat({all}).moonMine({all}).moonRoad({all}).nbsp.colon().megacredits(3);
          b.br.br;
        }),
        description: 'Once per game, gain 3 M€ for each tile on The Moon.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const moonSpacesCount = MoonExpansion.spaces(player.game, undefined, {surfaceOnly: true}).length;
    player.stock.add(Resource.MEGACREDITS, moonSpacesCount * 3, {log: true});
    return undefined;
  }
}
