import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';

export class HE3Refinery implements IProjectCard {
  public cost = 8;
  public tags = [Tags.MOON];
  public cardType = CardType.ACTIVE;
  public name = CardName.HE3_REFINERY;

  public play() {
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.megaCredits += MoonExpansion.moonData(player.game).miningRate;
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    cardNumber: 'M49',
    renderData: CardRenderer.builder((b) => {
      b.action('Gain 1 M€ for each level of Mining Rate.', (eb) => {
        eb.empty().startAction;
        eb.megacredits(1).slash().moonMiningRate();
      });
    }),
  };
}
