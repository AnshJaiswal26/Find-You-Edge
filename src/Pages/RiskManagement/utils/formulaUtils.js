import { fieldLabels } from "@RM/data/calculatorsData";

export const getFormulaMap = (selected) => ({
  name: selected,
  buyPrice: "Sell Price - Pts",
  sellPrice:
    selected === "riskReward"
      ? "Buy Price + (SL Pts × Risk-Reward)"
      : "Buy Price + Pts",
  pts:
    selected === "riskReward"
      ? "SL Pts × Risk-Reward"
      : selected.includes("Price")
      ? "Sell Price - Buy Price"
      : "Amount / Qty",
  amount:
    selected === "riskReward"
      ? "SL Amount × Risk-Reward"
      : selected === "percent"
      ? "Capital × (Pnl (%) / 100)"
      : "Pts × Qty",
  percent:
    selected === "riskReward"
      ? "SL Pnl(%) × Risk-Reward"
      : "(Amount / Capital) × 100",
});

export const getFormula = (field, { currentSection, affected, formulaMap }) => {
  const oppoSec = currentSection === "Target" ? "SL" : "Target";
  const operator = currentSection === "Target" ? "×" : "/";

  if (affected.length === 6) {
    return field === "buyPrice" || field === "qty"
      ? `from ${oppoSec}`
      : field === "sellPrice"
      ? `Buy Price + (${oppoSec} Pts ${operator} Risk-Reward)`
      : `${oppoSec} ${fieldLabels[field]} ${operator} Risk-Reward`;
  } else return formulaMap[field];
};
