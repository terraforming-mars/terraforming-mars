import {CardName} from '../../../common/cards/CardName';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';

export class Xavier extends CeoCard {
  constructor() {
    super({
      name: CardName.XAVIER,
      metadata: {
        cardNumber: 'L24',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('GAIN').tag(Tag.WILD, 2).asterix();
          b.br;
          b.plainText('Once per game, gain 2 wild tags for THIS GENERATION.');
          b.br.br;
          b.effect('AFTER this action has been used, when playing a card with a requirement, you pay 1 M€ less for it.',
            (eb) => eb.asterix().startEffect.cards(1, {secondaryTag: AltSecondaryTag.REQ}).colon().megacredits(-1));
        }),
      },
    });
  }

  public opgActionIsActive = false;

  public override get tags(): Array<Tag> {
    return this.opgActionIsActive ? [Tag.WILD, Tag.WILD] : [];
  }

  public action(): PlayerInput | undefined {
    this.isDisabled = true;
    this.opgActionIsActive = true;
    return undefined;
  }

  public override getCardDiscount(_player: IPlayer, card: IProjectCard) {
    if (this.isDisabled && card.requirements.length > 0) return 1;
    return 0;
  }
}
