import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {Units} from '../../common/Units';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Size} from '../render/Size';
import {digit} from '../Options';

export class AsteroidResources extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_RESOURCES,
      cost: 17,
      tags: [Tags.JOVIAN, Tags.SPACE],
      reserveUnits: Units.of({energy: 3}),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf40',
        renderData: CardRenderer.builder((b) => {
          b.minus().energy(3, {digit}).production((pb) => pb.steel(1).titanium(1)).br
            .or(Size.SMALL).br;
          b.minus().energy(3, {digit}).oceans(1, {size: Size.SMALL}).steel(2, {digit}).titanium(1);
        }),
        description: 'Spend 3 energy. Either increase your steel and titanium production one step, OR ' +
          'place an ocean, and gain 2 steel and one titanium.',
      },
    });
  }

  public override canPlay(player: Player) {
    return player.hasUnits(this.reserveUnits);
  }
  public play(player: Player) {
    const options = new OrOptions(
      new SelectOption('Increase your steel and titanium production 1 step.', 'Select', () => {
        player.deductUnits(this.reserveUnits);
        player.addProduction(Resources.STEEL, 1, {log: true});
        player.addProduction(Resources.TITANIUM, 1, {log: true});
        return undefined;
      }),
      new SelectOption('Place an ocean, and gain 2 steel and one titanium.', 'Select', () => {
        player.deductUnits(this.reserveUnits);
        player.addResource(Resources.STEEL, 2, {log: true});
        player.addResource(Resources.TITANIUM, 1, {log: true});
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }),
    );

    // Autoresolve the first option if Reds are in power and the player can't pay the reds tax for an ocean.
    if (!player.canAfford(0, {tr: {oceans: 1}})) {
      options.options[0].cb();
      return undefined;
    }
    return options;
  }
}
