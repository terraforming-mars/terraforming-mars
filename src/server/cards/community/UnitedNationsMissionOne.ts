import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {all} from '../Options';
import {Phase} from '../../../common/Phase';
import {Resource} from '../../../common/Resource';

export class UnitedNationsMissionOne extends CorporationCard {
  constructor() {
    super({
      name: CardName.UNITED_NATIONS_MISSION_ONE,
      tags: [Tag.EARTH],
      startingMegaCredits: 40, // +1 for the initial change in TR.

      metadata: {
        cardNumber: 'R50',
        description: 'You start with 39 M€. Increase your TR 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(39).nbsp.tr(1);
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('When any player takes an action or plays a card that increases TR, including this, gain 1 M€ for each step.', (eb) => {
              eb.tr(1, {all}).startEffect.megacredits(1);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer): undefined {
    player.increaseTerraformRating();
    return undefined;
  }

  // TODO(kberg): Since UNMO can generate MC for raising TR, that MC can offset reds costs, can't it?
  public onIncreaseTerraformRating(player: IPlayer, cardOwner: IPlayer, steps: number) {
    const game = player.game;

    if (game.phase === Phase.ACTION || game.phase === Phase.PRELUDES) {
      cardOwner.stock.add(Resource.MEGACREDITS, steps, {log: true});
    }
  }
}
