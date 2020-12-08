import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Insulation implements IProjectCard {
    public cost = 2;
    public tags = [];
    public name = CardName.INSULATION;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player) {
      return player.getProduction(Resources.HEAT) >= 1;
    }

    public play(player: Player, _game: Game) {
      return new SelectAmount(
        'Select amount of heat production to decrease',
        'Decrease',
        (amount: number) => {
          player.addProduction(Resources.HEAT, -amount);
          player.addProduction(Resources.MEGACREDITS, amount);
          return undefined;
        },
        1,
        player.getProduction(Resources.HEAT),
      );
    }
    public metadata: CardMetadata = {
      cardNumber: '152',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.text('-X').heat(1).nbsp.text('+').megacredits(0).multiplier;
        });
      }),
      description: 'Decrease your heat production any number of steps and increase your MC production the same number of steps.',
    }
}
