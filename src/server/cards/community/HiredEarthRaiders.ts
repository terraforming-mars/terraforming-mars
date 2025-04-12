import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {message} from '../../logs/MessageBuilder';
import { Tag } from '../../../common/cards/Tag';

export class HiredEarthRaiders extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      tags: [Tag.EARTH],
      name: CardName.HIRED_EARTH_RAIDERS,
      cost: 1,
      metadata: {
        cardNumber: 'UX02',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.MEDIUM, true).megacredits(1, {all}).slash().tag(Tag.EARTH, {all: false}).minus().tag(Tag.EARTH, {all: true});
        }),
        description: 'Amount of money per your earth tags - opponents earth tags',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      return undefined;
    }

    const availableActions = new OrOptions();

    player.getOpponents().forEach((target) => {
      if (target.megaCredits > 0) {
        const difference = player.tags.countAllTags()[Tag.EARTH] - target.tags.countAllTags()[Tag.EARTH];
        const amount = difference < 0 ? 0 : difference;
        const amountStolen = Math.min(amount, target.megaCredits);
        const optionTitle = message('Steal ${0} M€ from ${1}', (b) => b.number(amountStolen).player(target));

        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.attack(player, Resource.MEGACREDITS, amountStolen, {log: true, stealing: true});
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not steal'));
      return availableActions;
    }
    return undefined;
  }
}
