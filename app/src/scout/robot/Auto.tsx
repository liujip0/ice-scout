import { TeamMatchEntry } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Divider, Stack, ToggleButtonGroup } from "@mui/material";
import EventEmitter from "events";
import { useEffect, useRef, useState } from "react";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import { BigCounter } from "../Components.tsx";

type AutoProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  eventEmitter: EventEmitter;
};
export default function Auto({ match, setMatch, eventEmitter }: AutoProps) {
  const teleopTimeoutHasRun = useRef(false);
  const teleopTimeout = useRef<NodeJS.Timeout | null>(null);
  console.log("---", teleopTimeout.current);
  useEffect(() => {
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("-------------------------------------");
        eventEmitter.emit("teleop-animation");
      }
    }, 40000);
    return () => {
      if (teleopTimeout.current) {
        clearTimeout(teleopTimeout.current);
      }
    };
  }, [eventEmitter]);
  const [teleopTimeoutButtonClicked, setTeleopTimeoutButtonClicked] =
    useState(false);
  const teleopTimeoutButtonClick = () => {
    if (teleopTimeoutButtonClicked) {
      return;
    }

    console.log("teleopTimeoutButtonClick");
    setTeleopTimeoutButtonClicked(true);
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
        eventEmitter.emit("teleop-animation");
      }
    }, 30000);
  };
  eventEmitter.on("teleop-animation", () => {
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
  });

  return (
    <Stack
      direction="row"
      sx={{
        width: 1,
        height: 1,
      }}>
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <BigCounter
          value={match.autoNetZoneSamp!}
          increment={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoNetZoneSamp: match.autoNetZoneSamp! + 1,
            });
          }}
          decrement={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoNetZoneSamp: match.autoNetZoneSamp! - 1,
            });
          }}
          label="Net Zone Samples"
        />
        <BigCounter
          value={match.autoLowBasketSamp!}
          increment={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoLowBasketSamp: match.autoLowBasketSamp! + 1,
            });
          }}
          decrement={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoLowBasketSamp: match.autoLowBasketSamp! - 1,
            });
          }}
          label="Low Basket Samples"
        />
        <BigCounter
          value={match.autoHighBasketSamp!}
          increment={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoHighBasketSamp: match.autoHighBasketSamp! + 1,
            });
          }}
          decrement={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoHighBasketSamp: match.autoHighBasketSamp! - 1,
            });
          }}
          label="High Basket Samples"
        />
      </Stack>
      <Divider orientation="vertical" />
      <Stack
        sx={{
          width: "50%",
          height: "100%",
          padding: 2,
        }}
        gap={2}>
        <StyledRedToggleButton
          value="Robot Died?"
          selected={match.died!}
          onChange={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              died: !match.died,
            });
          }}>
          Robot Died
        </StyledRedToggleButton>
        <Divider
          orientation="horizontal"
          flexItem
        />
        <BigCounter
          value={match.autoLowChamberSpec!}
          increment={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoLowChamberSpec: match.autoLowChamberSpec! + 1,
            });
          }}
          decrement={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoLowChamberSpec: match.autoLowChamberSpec! - 1,
            });
          }}
          label="Low Chamber Specimens"
        />
        <BigCounter
          value={match.autoHighChamberSpec!}
          increment={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoHighChamberSpec: match.autoHighChamberSpec! + 1,
            });
          }}
          decrement={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoHighChamberSpec: match.autoHighChamberSpec! - 1,
            });
          }}
          label="High Chamber Samples"
        />
        <Divider
          orientation="horizontal"
          flexItem
        />
        <ToggleButtonGroup
          sx={{
            width: 1,
          }}>
          <StyledToggleButton
            value="Observation Zone Park"
            selected={match.autoObservationZone!}
            onChange={() => {
              teleopTimeoutButtonClick();
              setMatch({
                ...match,
                autoObservationZone: !match.autoObservationZone,
                autoL1Climb: false,
              });
            }}
            sx={{
              flex: 1,
              padding: 1,
            }}>
            Observation Zone Park
          </StyledToggleButton>
          <StyledToggleButton
            value="L1 Ascent"
            selected={match.autoL1Climb!}
            onChange={() => {
              teleopTimeoutButtonClick();
              setMatch({
                ...match,
                autoL1Climb: !match.autoL1Climb,
                autoObservationZone: false,
              });
            }}
            sx={{
              flex: 1,
              padding: 1,
            }}>
            L1 Ascent
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
