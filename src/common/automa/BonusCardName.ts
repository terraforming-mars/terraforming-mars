/** The name of a MarsBot bonus card. */
export const BonusCardName = {
  METEOR_SHOWER: 'Meteor Shower', // B01
  INVASIVE_SPECIES: 'Invasive Species', // B02
  RESEARCH_AND_DEVELOPMENT: 'Research and Development', // B03
  OVERACHIEVEMENT: 'Overachievement', // B04
  EXPEDITED_CONSTRUCTION: 'Expedited Construction', // B05
  LOBBYISTS: 'Lobbyists', // B06
  LOCAL_NEURAL_INSTANCE: 'Local Neural Instance', // B07
  CORPORATE_COMPETITION: 'Corporate Competition', // B08
  CORPORATE_COMPETITION_HELLAS: 'Corporate Competition (Hellas)', // B09
  CORPORATE_COMPETITION_ELYSIUM: 'Corporate Competition (Elysium)', // B10
  CORPORATE_COMPETITION_UTOPIA: 'Corporate Competition (Utopia Planitia)', // B11
  CORPORATE_COMPETITION_CIMMERIA: 'Corporate Competition (Terra Cimmeria)', // B12
  CORPORATE_COMPETITION_BOREALIS: 'Corporate Competition (Vastitas Borealis)', // B13
  CORPORATE_COMPETITION_MA: 'Corporate Competition (Milestones & Awards)', // B14
  LOBBYISTS_VENUS: 'Lobbyists (Venus)', // B15
  GOVERNMENT_INTERVENTION: 'Government Intervention', // B16
  EXPEDITED_CONSTRUCTION_COLONIES: 'Expedited Construction (Colonies)', // B17
  OUTER_SYSTEM_FOOTHOLD: 'Outer System Foothold', // B18
  SHIPPING_LINES: 'Shipping Lines', // B19
  EXTENDED_SHIPPING_LINES: 'Extended Shipping Lines', // B20
  PARTY_POLITICS: 'Party Politics', // B21
  SETTLERS: 'Settlers', // B22
  RAPID_SPROUTING: 'Rapid Sprouting', // B23
  SUPPLY_AND_DEMAND: 'Supply & Demand', // B24
  DO_IT_RIGHT: 'Do It Right', // B25
  VENUSIAN_LOBBY: 'Venusian Lobby', // B26
  BUILD_BUILD_BUILD: 'Build, Build, Build', // B27
  DIVERSIFICATION: 'Diversification', // B28
  GRAY_EMINENCE: 'Gray Eminence', // B29
  INTERFACE_HYPERLINK: 'Interface Hyperlink', // B30
  GOVERNMENT_SUBSIDY: 'Government Subsidy', // B31
  INVESTORS: 'Investors', // B32
} as const;
export type BonusCardName = typeof BonusCardName[keyof typeof BonusCardName];
