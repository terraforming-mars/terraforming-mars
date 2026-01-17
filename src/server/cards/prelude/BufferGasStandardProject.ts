import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {StandardProjectCard} from '@/server/cards/StandardProjectCard';

export class BufferGasStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.BUFFER_GAS_STANDARD_PROJECT,
      cost: 16,
      tr: {tr: 1},
      metadata: {
        cardNumber: 'SP3',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 16 M€ to increase your TR 1 step. Solo games only.', (eb) => {
            eb.megacredits(16).startAction.tr(1);
          }),
        ),
      },
    });
  }

  actionEssence(player: IPlayer): void {
    player.increaseTerraformRating();
  }
}
