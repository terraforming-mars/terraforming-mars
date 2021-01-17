import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class LTFPrivileges extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LTF_PRIVILEGES,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON],
      cost: 21,

      metadata: {
        description: 'Effect: When playing a Moon tag, you do not pay additional Steel or Titanium for playing it.',
        cardNumber: 'M82',
        renderData: CardRenderer.builder((_b) => {}),
      },
    });
  };

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }
}
