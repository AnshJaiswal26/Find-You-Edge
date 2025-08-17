import { fieldLabels, postitionSizingFields } from "@RM/data";
import { CalcualtorSectionLayout } from "@RM/layout";
import { Input } from "..";

export default function PositionSizingSection() {
  const isReadOnly = (f) => f === "suggestedQty" || f === "adjustedSl";

  return (
    <CalcualtorSectionLayout
      name={"positionSizing"}
      onMouseEnter={() => null}
      inputGrid={postitionSizingFields.map((field) => (
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
    ></CalcualtorSectionLayout>
  );
}
