import {CardRequirements} from '../../src/cards/CardRequirements';
import {Tags} from '../../src/cards/Tags';
import {Resources} from '../../src/Resources';
import {PartyName} from '../../src/turmoil/parties/PartyName';
import {expect} from 'chai';

describe('CardRequirements', function() {
  it('ocean: success - 1', function() {
    expect(CardRequirements.builder((b) => b.oceans(1)).getRequirementsText()).to.equal(
      'Ocean',
    );
  });
  it('oceans: success - 3', function() {
    expect(CardRequirements.builder((b) => b.oceans(3)).getRequirementsText()).to.equal(
      '3 Oceans',
    );
  });
  it('oceans: success - max 3', function() {
    expect(CardRequirements.builder((b) => b.oceans(3, {max: true})).getRequirementsText()).to.equal(
      'max 3 Oceans',
    );
  });
  it('ocean: success - max 1', function() {
    expect(CardRequirements.builder((b) => b.oceans(1, {max: true})).getRequirementsText()).to.equal(
      'max 1 Ocean',
    );
  });
  it('oxygen: success ', function() {
    expect(CardRequirements.builder((b) => b.oxygen(3)).getRequirementsText()).to.equal(
      '3% O2',
    );
  });
  it('temperature (+): success', function() {
    expect(CardRequirements.builder((b) => b.temperature(2)).getRequirementsText()).to.equal(
      '2° C',
    );
  });
  it('temperature (0): success', function() {
    expect(CardRequirements.builder((b) => b.temperature(0)).getRequirementsText()).to.equal(
      '0° C',
    );
  });
  it('temperature (-): success', function() {
    expect(CardRequirements.builder((b) => b.temperature(-10)).getRequirementsText()).to.equal(
      '-10° C',
    );
  });
  it('temperature (-): success - max', function() {
    expect(
      CardRequirements.builder((b) => b.temperature(4, {max: true})).getRequirementsText(),
    ).to.equal('max 4° C');
  });
  it('venus: success', function() {
    expect(CardRequirements.builder((b) => b.venus(10)).getRequirementsText()).to.equal(
      '10% Venus',
    );
  });
  it('venus-max: success', function() {
    expect(CardRequirements.builder((b) => b.venus(4, {max: true})).getRequirementsText()).to.equal(
      'max 4% Venus',
    );
  });
  it('TR: success', function() {
    expect(CardRequirements.builder((b) => b.tr(25)).getRequirementsText()).to.equal('25 TR');
  });
  it('TR-max: success', function() {
    expect(CardRequirements.builder((b) => b.tr(4, {max: true})).getRequirementsText()).to.equal(
      'max 4 TR',
    );
  });
  it('Chairman: success', function() {
    expect(CardRequirements.builder((b) => b.chairman()).getRequirementsText()).to.equal(
      'Chairman',
    );
  });
  it('Cities-singular: success', function() {
    expect(CardRequirements.builder((b) => b.cities()).getRequirementsText()).to.equal('City');
  });
  it('Cities-plural: success', function() {
    expect(CardRequirements.builder((b) => b.cities(2)).getRequirementsText()).to.equal(
      '2 Cities',
    );
  });
  it('Any Cities-plural: success', function() {
    expect(CardRequirements.builder((b) => b.cities(2, {all: true})).getRequirementsText()).to.equal(
      'Any 2 Cities',
    );
  });
  it('Cities-max: success', function() {
    expect(CardRequirements.builder((b) => b.cities(4, {max: true})).getRequirementsText()).to.equal(
      'max 4 Cities',
    );
  });
  it('Colonies-singular: success', function() {
    expect(CardRequirements.builder((b) => b.colonies()).getRequirementsText()).to.equal(
      'Colony',
    );
  });
  it('Colonies-plural: max- success', function() {
    expect(CardRequirements.builder((b) => b.colonies(2, {max: true})).getRequirementsText()).to.equal(
      'max 2 Colonies',
    );
  });
  it('Greenery: success', function() {
    expect(CardRequirements.builder((b) => b.greeneries()).getRequirementsText()).to.equal(
      'Greenery',
    );
  });
  it('Greenerys-max: success', function() {
    expect(CardRequirements.builder((b) => b.greeneries(2, {max: true})).getRequirementsText()).to.equal(
      'max 2 Greeneries',
    );
  });
  it('Floater: success', function() {
    expect(CardRequirements.builder((b) => b.floaters(1)).getRequirementsText()).to.equal(
      'Floater',
    );
  });
  it('Floater: success - default', function() {
    expect(CardRequirements.builder((b) => b.floaters()).getRequirementsText()).to.equal(
      'Floater',
    );
  });
  it('Floaters-max: success', function() {
    expect(CardRequirements.builder((b) => b.floaters(2, {max: true})).getRequirementsText()).to.equal(
      'max 2 Floaters',
    );
  });
  it('Floater-max-1: success', function() {
    expect(CardRequirements.builder((b) => b.floaters(1, {max: true})).getRequirementsText()).to.equal(
      'max 1 Floater',
    );
  });
  it('Res type-max: success', function() {
    expect(
      CardRequirements.builder((b) => b.resourceTypes(1, {max: true})).getRequirementsText(),
    ).to.equal('max 1 Resource type');
  });
  it('Res types: success', function() {
    expect(CardRequirements.builder((b) => b.resourceTypes(9)).getRequirementsText()).to.equal(
      '9 Resource types',
    );
  });
  it('Tag-science(2): success', function() {
    expect(
      CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)).getRequirementsText(),
    ).to.equal('2 Science');
  });
  it('Tag-science: success', function() {
    expect(
      CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 1)).getRequirementsText(),
    ).to.equal('Science');
  });
  it('Tag-science: default - success', function() {
    expect(CardRequirements.builder((b) => b.tag(Tags.SCIENCE)).getRequirementsText()).to.equal(
      'Science',
    );
  });
  it('Production-steel: success', function() {
    expect(
      CardRequirements.builder((b) => b.production(Resources.STEEL)).getRequirementsText(),
    ).to.equal('Steel production');
  });
  it('Production-titanium: success', function() {
    expect(
      CardRequirements.builder((b) =>
        b.production(Resources.TITANIUM, 1),
      ).getRequirementsText(),
    ).to.equal('Titanium production');
  });
  it('Production-titanium: success - default', function() {
    expect(
      CardRequirements.builder((b) => b.production(Resources.TITANIUM)).getRequirementsText(),
    ).to.equal('Titanium production');
  });
  it('Production-energy(2): success', function() {
    expect(
      CardRequirements.builder((b) => b.production(Resources.ENERGY, 2)).getRequirementsText(),
    ).to.equal('2 Energy production');
  });
  it('Party-mars first: success', function() {
    expect(
      CardRequirements.builder((b) => b.party(PartyName.MARS)).getRequirementsText(),
    ).to.equal('mars first');
  });
  it('Party-reds: success', function() {
    expect(
      CardRequirements.builder((b) => b.party(PartyName.REDS)).getRequirementsText(),
    ).to.equal('reds');
  });
  it('Party-leaders: success', function() {
    expect(CardRequirements.builder((b) => b.partyLeaders(2)).getRequirementsText()).to.equal(
      '2 Party leaders',
    );
  });
  it('Party-leader: success', function() {
    expect(CardRequirements.builder((b) => b.partyLeaders()).getRequirementsText()).to.equal(
      'Party leader',
    );
  });
});
