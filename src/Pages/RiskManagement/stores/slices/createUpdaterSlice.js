import { calculatorUpdater, toolTipUpdater } from "@RM/utils/updaterUtils";

const updater = (name, prev, update) => ({
  [name]: { ...prev[name], ...update },
});

export const createUpdaterSlice = (set) => ({
  update: {
    hoveredInput: (name) => set({ hoveredInput: name }),
    tab: (updates) => set({ currentTab: updates }),
    transaction: (updates) => set({ currentTransaction: updates }),
    tooltip: (section, updates) => {
      set((prev) => {
        if (section === "riskReward")
          return updater("tooltip", prev, {
            [section]: { ratio: updates },
          });
        const data = toolTipUpdater(section, updates, prev.tooltip[section]);
        return updater("tooltip", prev, data);
      });
    },
    settings: (section, updates) => {
      set((prev) => {
        if (section === "show")
          return updater("settings", prev, { show: updates });
        if (section === "selectedSection")
          return updater("settings", prev, { selectedSection: updates });
        return updater("settings", prev, {
          [section]: { ...prev.settings[section], ...updates },
        });
      });
    },
    section: (section, updates, cfg) =>
      calculatorUpdater(set, section, updates, cfg),
  },
});
