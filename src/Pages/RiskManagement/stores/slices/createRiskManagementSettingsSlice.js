export const createRiskManagementSettingsSlice = (set) => ({
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

    updateSettings: (section, updates) => {
      set((prev) => {
        if (section === "show") return { show: updates };
        if (section === "selectedSection") return { selectedSection: updates };
        return {
          [section]: { ...prev[section], ...updates },
        };
      });
    },
  },
});
