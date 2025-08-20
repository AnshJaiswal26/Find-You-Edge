export const createRiskManagementSettingsSlice = () => ({
  settings: {
    show: false,

    calculation: {
      autoRound: false,
      mode: "Approx",
    },

    derived: {
      input: "sellPrice",
      adjust: "sellPrice",
    },

    logicGuide: {
      selectedField: "buyPrice",
    },

    selectedSection: "Calculator",
  },
});
