import {Card} from '../Card';
import {CeoCard} from './CeoCard';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../../common/Resources';
import {all} from '../Options';

export class Apollo extends Card implements CeoCard {
  constructor() {
    super({
      name: CardName.APOLLO,
      cardType: CardType.CEO,
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

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const moonSpacesCount = MoonExpansion.spaces(player.game, undefined, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, moonSpacesCount * 3, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}
