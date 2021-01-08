import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class RegoPlastics implements IProjectCard {
    public name = CardName.REGO_PLASTICS;
    public cost = 10;
    public tags = [Tags.BUILDING];
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.increaseSteelValue();
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public onDiscard(player: Player): void {
      player.decreaseSteelValue();
    }

    public metadata: CardMetadata = {
      cardNumber: 'X10',
      renderData: CardRenderer.builder((b) => {
        b.effect('Your steel resources are worth 1 MC extra.', (eb) => {
          eb.steel(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
        });
      }),
      victoryPoints: 1,
    }
}
