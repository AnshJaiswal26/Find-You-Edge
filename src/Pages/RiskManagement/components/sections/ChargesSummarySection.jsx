import { Button } from "@components";
import { useRiskManagementStore } from "@RM/stores";
import { useTradeSummary, useChargesLogic } from "@RM/hooks";
import { formatINR, safe } from "@RM/utils";

export default function ChargesSummarySection() {
  console.log("ChargesSummarySection...");

  return (
    <div className="charges-summary">
      <div className="flex justify wrap">
        <div className="transaction-summary-title">Charges Summary</div>
        <div className="flex gap10">
          <label className="risk-label" style={{ fontSize: "20px" }}>
            Charges
          </label>
          <ToggleChargesButtons />
        </div>
      </div>
      <ChargesSummaryList />
    </div>
  );
}

function ToggleChargesButtons() {
  const active = useRiskManagementStore((s) => s.anyTooltipActive);

  const charges = useChargesLogic();

  return (
    <div className="flex gap10">
      <Button
        text="Add"
        color="#05ab72"
        onClick={() => charges("added")}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
          disabled: active,
        }}
      />
      <Button
        text="Remove"
        color="#fe5a5a"
        onClick={() => charges("removed")}
        style={{
          padding: "3px 10px",
          fontSize: "12px",
          disabled: active,
        }}
      />
    </div>
  );
}

function ChargesSummaryList() {
  const { breakevenPts, tradeVal, charges } = useTradeSummary();

  const chargesSummaryList = [
    { label: "Turnover", value: Math.ceil(tradeVal) },
    { label: "Brokerage", value: charges.brokerage },
    { label: "Exchange Transaction Charges", value: charges.eT },
    { label: "DP Charges", value: charges.dp },
    { label: "Securities Transaction Tax STT", value: charges.stt },
    { label: "SEBI Turnover Charges", value: charges.sebi },
    { label: "Investor Protection Fund Trust IPFT", value: charges.ipft },
    { label: "Stamp Duty", value: charges.stampDuty },
    { label: "GST", value: charges.gst },
    { label: "Total Tax & Charges", value: charges.total },
    {
      label: "Points to Breakeven (No Profit No Loss)",
      value: "+" + safe(breakevenPts, 2),
    },
  ];
  return (
    <>
      {chargesSummaryList.map((item, idx) => (
        <div className="charges-summary-row" key={idx}>
          <span className="charges-summary-label">{item.label}</span>
          <span className="charges-summary-value">
            {typeof item.value === "number"
              ? formatINR(item.value || 0)
              : item.value}
          </span>
        </div>
      ))}
    </>
  );
}
