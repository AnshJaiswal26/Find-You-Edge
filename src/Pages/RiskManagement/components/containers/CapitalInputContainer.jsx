import { IconButton, ValidationTooltip } from "@components";
import { Container } from "@layout";
import { Input } from "@RM/components";
import { useNote, useSettings, useRiskCalculator } from "@RM/context";

export function CapitalInputContainer() {
  const { updateSettings } = useSettings();

  console.log("CapitalInputContainer...");

  return (
    <Container>
      <div className="flex justify center">
        <div className="relative">
          <CapitalInput />
        </div>
        <IconButton
          src="Icons/others/adjust.png"
          onClick={() => updateSettings({ show: true })}
        />
      </div>
    </Container>
  );
}

function CapitalInput() {
  const { capital } = useRiskCalculator();
  const { note, showNote } = useNote();

  return (
    <>
      <Input
        className={note.capital.current ? "info" : ""}
        label={"Trading Capital"}
        section={capital}
        field={"capital"}
        value={capital.current}
      />
      <ValidationTooltip
        message="Enter Capital to calculate returns in %"
        position="bottom"
        isVisible={note.capital.current}
        onClose={() => showNote("capital", "current", false)}
        type="info"
        autoHide={true}
        showCloseButton={true}
      />
    </>
  );
}
