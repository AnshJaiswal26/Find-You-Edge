import { fieldLabels, fields } from "@RM/data";
import { CalcualtorSectionLayout } from "@RM/layout";
import { Input } from "..";
import { useClearLogic } from "@RM/hooks";
import { Button } from "@components";

export default function PositionSizingSection() {
  const isReadOnly = (f) => f === "suggestedQty" || f === "adjustedSl";
  const clearSection = useClearLogic();

  return (
    <CalcualtorSectionLayout
      name={"positionSizing"}
      onMouseEnter={() => null}
      inputGrid={fields["positionSizing"].map((field) => (
        <div className="relative" key={field}>
          <Input
            className={isReadOnly(field) ? "readOnly" : ""}
            label={fieldLabels[field]}
            sectionName={"positionSizing"}
            field={field}
            readOnly={isReadOnly(field)}
            // value={0}
          ></Input>
        </div>
      ))}
    >
      <div className="footer-buttons">
        <Button
          text="Clear All"
          color="#fe5a5a"
          onClick={() => clearSection("positionSizing")}
          style={{
            padding: "3px 10px",
            fontSize: "12px",
          }}
        />
      </div>
    </CalcualtorSectionLayout>
  );
}
