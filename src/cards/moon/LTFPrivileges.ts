import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LTFPrivileges implements IProjectCard {
  public cost = 21;
  public tags = [Tags.MOON];
  public cardType = CardType.ACTIVE;
  public name = CardName.LTF_PRIVILEGES;

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Effect: When playing a Moon tag, you do not pay additional Steel or Titanium for playing it.',
    cardNumber: 'M82',
    renderData: CardRenderer.builder((_b) => {}),
  };
}
