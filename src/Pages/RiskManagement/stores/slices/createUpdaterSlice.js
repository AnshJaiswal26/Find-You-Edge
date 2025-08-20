import { calculatorUpdater, logObj, toolTipUpdater } from "@RM/utils";

const defaultCfg = { flashing: true, duration: 100, round: true };

const updater = (name, prev, update) => ({
  [name]: { ...prev[name], ...update },
});

function applySectionUpdate(set, prev, sectionUpdates, cfg) {
  return Object.entries(sectionUpdates).reduce((acc, [name, updates]) => {
    if (name.includes("Tooltip")) {
      return { ...acc, ...toolTipUpdater(name, updates, prev[name]) };
    }
    logObj("sec", name);
    return { ...acc, ...calculatorUpdater(set, prev, name, updates, cfg) };
  }, {});
}

export const createUpdaterSlice = (set) => ({
  update: {
    hoveredInput: (name) => set({ hoveredInput: name }),
    tab: (updates) => set({ currentTab: updates }),
    transaction: (updates) => set({ currentTransaction: updates }),
    tooltip: (section, updates) => {
      set((prev) => {
        const data = toolTipUpdater(
          section,
          updates,
          prev[section + "Tooltip"]
        );
        return data;
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

    section: (sec, updates, inputCfg) => {
      const cfg = { ...defaultCfg, ...inputCfg };
      set((prev) => {
        return calculatorUpdater(set, prev, sec, updates, cfg);
      });
    },

    sections: (sectionUpdates, inputCfg) => {
      const cfg = { ...defaultCfg, ...inputCfg };
      set((prev) => {
        return applySectionUpdate(set, prev, sectionUpdates, cfg) || prev;
      });
    },
  },
});
