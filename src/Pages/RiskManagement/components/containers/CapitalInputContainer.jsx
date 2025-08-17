import { IconButton } from "@components";
import { Container } from "@layout";
import RenderLogger from "@Profiler";
import { Input } from "@RM/components";
import { useRiskManagementStore } from "@RM/stores";

export function CapitalInputContainer() {
  const updateSettings = useRiskManagementStore((s) => s.update.settings);

  return (
    // <RenderLogger id={"CapitalInputContainer"} why={"updateSettings"}>
    <Container>
      <div className="flex justify center">
        <div className="relative">
          <Input
            label={"Trading Capital"}
            sectionName={"capital"}
            field={"current"}
          />
        </div>
        <IconButton
          src="Icons/others/adjust.png"
          onClick={() => updateSettings("show", true)}
        />
      </div>
    </Container>
    // </RenderLogger>
  );
}
