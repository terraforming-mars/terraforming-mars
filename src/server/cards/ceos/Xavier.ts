import {CardName} from '../../../common/cards/CardName';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {played} from '../Options';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';

export class Xavier extends CeoCard {
  constructor() {
    super({
      name: CardName.XAVIER,
      metadata: {
        cardNumber: 'L24',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('GAIN').nbsp.wild(2, {played});
          b.br.br;
          b.cards(1, {secondaryTag: AltSecondaryTag.REQ}).colon().megacredits(-2);
          b.br.br;
        }),
        description: 'Once per game, gain 2 wild tags for THIS GENERATION. When playing a card with a requirement, you pay 1 M€ less for it AFTER this action has been used.',
      },
    });
  }

  public opgActionIsActive = false;

  public action(): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }

  public override getCardDiscount(_player: IPlayer, card: IProjectCard) {
    if (this.isDisabled && card.requirements !== undefined) return 1;
    return 0;
  }
}
