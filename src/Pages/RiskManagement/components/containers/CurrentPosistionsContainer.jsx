import { Container } from "@layout";
import { useCalculatorStore, useTab } from "@RM/context";
import { useClearLogic } from "@RM/hooks";

export function CurrentPositionsContainer() {
  console.log("CurrentPositionsContainer...");

  const updateSection = useCalculatorStore((cxt) => cxt.updateSection);
  const { setCurrentTab } = useTab();
  const { clearTargetAndStopLoss } = useClearLogic();

  const data = [
    {
      symbol: "BANKNIFTY",
      type: "ATM",
      date: "24-Nov-22",
      strike: "41350",
      optionType: "CE",
      buyPrice: "62.70",
      currentPrice: "65.25",
      quantity: "100",
    },
    {
      symbol: "BANKNIFTY",
      type: "OTM",
      date: "24-Nov-22",
      strike: "41450",
      optionType: "CE",
      buyPrice: "146.75",
      currentPrice: "176.05",
      quantity: "75",
    },
  ];

  const handlePriceSelect = (item) => {
    clearTargetAndStopLoss();

    setCurrentTab("risk-management");

    const updated = {
      buyPrice: Number(item.buyPrice),
      qty: Number(item.quantity),
      sellPrice: Number(item.buyPrice),
    };

    updateSection("stopLoss", updated);
    updateSection("target", updated);
  };

  return (
    <Container className="radius-top-0">
      <div className="banknifty-container">
        {data.map((item, index) => (
          <div
            key={index}
            className="trading-item"
            onClick={() => handlePriceSelect(item)}
          >
            <div className="left-section">
              <div className="symbol-row">
                <span className="symbol-name">{item.symbol}</span>
                <span className={`type-badge ${item.type.toLowerCase()}`}>
                  {item.type}
                </span>
              </div>
              <div className="option-details">
                {item.date} {item.strike} {item.optionType}
              </div>
            </div>
            <div className="right-section">
              <div className="price-info">
                <div className="price-label">Buy Price</div>
                <div className="buy-price">₹{item.buyPrice}</div>
                <div className="quantity-info">Qty: {item.quantity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
