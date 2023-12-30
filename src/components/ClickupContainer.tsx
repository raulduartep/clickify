import { Container } from "./Container";
import { ClickupStartStopTimeButton } from "./ClickupStartStopTimeButton";

import { TClickupVersion } from "../@types/clickup";
import { ClickupEditButton } from "./ClickupEditButton";
import { StyleHelper } from "../helpers/StyleHelper";

type TProps = {
  version: TClickupVersion;
};

export const ClickupContainer = ({ version }: TProps) => {
  return (
    <Container>
      <div
        className={StyleHelper.mergeStyles("flex gap-2", {
          "mx-4 ": version === "v2",
          "flex-col mt-3": version === "v3",
        })}
      >
        <ClickupStartStopTimeButton version={version} />

        <ClickupEditButton version={version} />
      </div>
    </Container>
  );
};
