import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IProjectCard} from '../IProjectCard';
import {Priority, SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {all, digit, played} from '../Options';
import {SerializedCard} from '../../SerializedCard';

export class PharmacyUnion extends CorporationCard {
  constructor() {
    super({
      name: CardName.PHARMACY_UNION,
      startingMegaCredits: 46, // 54 minus 8 for the 2 deseases
      resourceType: CardResource.DISEASE,

      behavior: {
        drawCard: {count: 1, tag: Tag.SCIENCE},
        addResources: 2,
      },

      metadata: {
        cardNumber: 'R39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(54).cards(1, {secondaryTag: Tag.SCIENCE});
          // blank space after MC is on purpose
          b.text('(You start with 54 M€ . Draw a Science card.)', Size.TINY, false, false);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.microbes(1, {all, played}).startEffect.disease().megacredits(-4);
            });
            ce.vSpace();
            ce.effect('When ANY microbe tag is played, add a disease here and lose 4 M€ or as much as possible. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you MAY put this card face down in your EVENTS PILE to gain 3 TR.', (eb) => {
              eb.science(1, {played}).startEffect.minus().disease();
              eb.tr(1, {size: Size.SMALL}).slash().tr(3, {size: Size.SMALL, digit});
            });
          });
        }),
      },
    });
  }

  public isDisabled = false;

  public override get tags() {
    if (this.isDisabled) {
      return [];
    }
    return [Tag.MICROBE, Tag.MICROBE];
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this._onCardPlayed(player, card);
    return undefined;
  }

  private _onCardPlayed(player: IPlayer, card: IProjectCard | ICorporationCard): void {
    if (this.isDisabled) return undefined;

    const game = player.game;

    const hasScienceTag = player.tags.cardHasTag(card, Tag.SCIENCE);
    const hasMicrobesTag = card.tags.includes(Tag.MICROBE);
    const isPharmacyUnion = player.isCorporation(CardName.PHARMACY_UNION);

    // Edge case, let player pick order of resolution (see https://github.com/bafolts/terraforming-mars/issues/1286)
    if (isPharmacyUnion && hasScienceTag && hasMicrobesTag && this.resourceCount === 0) {
      // TODO (Lynesth): Modify this when https://github.com/bafolts/terraforming-mars/issues/1670 is fixed
      if (player.canAfford({cost: 0, tr: {tr: 3}})) {
        game.defer(new SimpleDeferredAction(
          player,
          () => {
            const orOptions = new OrOptions(
              new SelectOption('Turn it face down to gain 3 TR and lose up to 4 M€').andThen(() => {
                const megaCreditsLost = Math.min(player.megaCredits, 4);
                this.isDisabled = true;
                player.increaseTerraformRating(3);
                player.stock.deduct(Resource.MEGACREDITS, megaCreditsLost);
                game.log('${0} turned ${1} face down to gain 3 TR and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
                return undefined;
              }),
              new SelectOption('Add a disease to it and lose up to 4 M€, then remove a disease to gain 1 TR').andThen(() => {
                const megaCreditsLost = Math.min(player.megaCredits, 4);
                player.increaseTerraformRating();
                player.megaCredits -= megaCreditsLost;
                game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
                game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
                return undefined;
              }),
            );
            orOptions.title = 'Choose the order of tag resolution for Pharmacy Union';
            return orOptions;
          },
        ), -1); // Make it a priority
        return undefined;
      }
    }

    if (isPharmacyUnion && hasScienceTag) {
      const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
      for (let i = 0; i < scienceTags; i++) {
        game.defer(new SimpleDeferredAction(
          player,
          () => {
            if (this.isDisabled) return undefined;

            if (this.resourceCount > 0) {
              if (player.canAfford({cost: 0, tr: {tr: 1}}) === false) {
                // TODO (Lynesth): Remove this when #1670 is fixed
                game.log('${0} cannot remove a disease from ${1} to gain 1 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
              } else {
                this.resourceCount--;
                player.increaseTerraformRating();
                game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
              }
              return undefined;
            }

            if (player.canAfford({cost: 0, tr: {tr: 3}}) === false) {
              // TODO (Lynesth): Remove this when #1670 is fixed
              game.log('${0} cannot turn ${1} face down to gain 3 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
              return undefined;
            }

            return new OrOptions(
              new SelectOption('Turn this card face down and gain 3 TR', 'Gain TR').andThen(() => {
                this.isDisabled = true;
                player.increaseTerraformRating(3);
                game.log('${0} turned ${1} face down to gain 3 TR', (b) => b.player(player).card(this));
                return undefined;
              }),
              new SelectOption('Do nothing', 'Do nothing'),
            );
          },
        ), -1); // Make it a priority
      }
    }


    if (hasMicrobesTag) {
      game.defer(new SimpleDeferredAction(
        player,
        () => {
          const microbeTagCount = card.tags.filter((cardTag) => cardTag === Tag.MICROBE).length;
          const player = game.getPlayers().find((p) => p.isCorporation(this.name));
          if (player === undefined) {
            throw new Error(`PharmacyUnion: did not find player for ${game.id}`);
          }
          const megaCreditsLost = Math.min(player.megaCredits, microbeTagCount * 4);
          player.addResourceTo(this, microbeTagCount);
          player.megaCredits -= megaCreditsLost;
          game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
          return undefined;
        },
      ), Priority.SUPERPOWER);
    }

    return undefined;
  }

  public serialize(serialized: SerializedCard) {
    serialized.isDisabled = this.isDisabled;
  }

  public deserialize(serialized: SerializedCard) {
    this.isDisabled = Boolean(serialized.isDisabled);
  }
}
