import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';

export class FabricatedScandal extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FABRICATED_SCANDAL,
      type: CardType.EVENT,
      cost: 15,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U13',
        renderData: CardRenderer.builder((b) => {
          b.corruption().br;
          b.text('most').tr(1, {all}).colon().minus().tr(1).br;
          b.text('least').tr(1, {all}).colon().plus().tr(1).br;
        }),
        description: 'Gain 1 corruption. The players with the highest TR lose 1 TR. ' +
          'Then the players with the lowest TR gain 1 TR, if possible.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const highestTR = Math.max(...game.getPlayers().map(((p) => p.getTerraformRating())));
    game.getPlayers().forEach((p) => {
      if (p.getTerraformRating() === highestTR) {
        p.decreaseTerraformRating(1, {log: true});
      }
    });

    const lowestTR = Math.min(...game.getPlayers().map(((p) => p.getTerraformRating())));
    game.getPlayers().forEach((p) => {
      if (p.getTerraformRating() === lowestTR && player.canAfford({cost: 0, tr: {tr: 1}})) {
        p.increaseTerraformRating(1, {log: true});
      }
    });
    return undefined;
  }
}
