import { TeamMatchEntry } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Divider, Stack, ToggleButtonGroup } from "@mui/material";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import { BigCounter } from "../Components.tsx";

type TeleopProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
};
export function Teleop({ match, setMatch }: TeleopProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        height: "auto",
        width: "100%",
        overflow: "auto",
      }}>
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <StyledRedToggleButton
          value="Robot Died?"
          selected={match.died!}
          onChange={() => {
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
          value={match.teleopNetZoneSamp!}
          increment={() => {
            setMatch({
              ...match,
              teleopNetZoneSamp: match.teleopNetZoneSamp! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              teleopNetZoneSamp: match.teleopNetZoneSamp! - 1,
            });
          }}
          label="Net Zone Samples"
        />
        <BigCounter
          value={match.teleopLowBasketSamp!}
          increment={() => {
            setMatch({
              ...match,
              teleopLowBasketSamp: match.teleopLowBasketSamp! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              teleopLowBasketSamp: match.teleopLowBasketSamp! - 1,
            });
          }}
          label="Low Basket Samples"
        />
        <BigCounter
          value={match.teleopHighBasketSamp!}
          increment={() => {
            setMatch({
              ...match,
              teleopHighBasketSamp: match.teleopHighBasketSamp! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              teleopHighBasketSamp: match.teleopHighBasketSamp! - 1,
            });
          }}
          label="High Basket Samples"
        />
      </Stack>
      <Divider orientation="vertical" />
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <BigCounter
          value={match.teleopLowChamberSpec!}
          increment={() => {
            setMatch({
              ...match,
              teleopLowChamberSpec: match.teleopLowChamberSpec! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              teleopLowChamberSpec: match.teleopLowChamberSpec! - 1,
            });
          }}
          label="Low Chamber Specimens"
        />
        <BigCounter
          value={match.teleopHighChamberSpec!}
          increment={() => {
            setMatch({
              ...match,
              teleopHighChamberSpec: match.teleopHighChamberSpec! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              teleopHighChamberSpec: match.teleopHighChamberSpec! - 1,
            });
          }}
          label="High Chamber Specimens"
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
            selected={match.endgameObservationZone!}
            sx={{
              flex: 1,
              padding: 2,
              "&:hover": {
                backgroundColor: "#313438", // light teal or whatever fits your theme
              },
            }}
            onChange={() => {
              setMatch({
                ...match,
                endgameObservationZone: !match.endgameObservationZone,
                endgameL1Climb: false,
                endgameL2Climb: false,
                endgameL3Climb: false,
              });
            }}>
            Observation Zone Park
          </StyledToggleButton>
          <StyledToggleButton
            value="L1 Ascent"
            selected={match.endgameL1Climb!}
            sx={{
              flex: 1,
              padding: 2,
            }}
            onChange={() => {
              setMatch({
                ...match,
                endgameObservationZone: false,
                endgameL1Climb: !match.endgameL1Climb,
                endgameL2Climb: false,
                endgameL3Climb: false,
              });
            }}>
            L1 Ascent
          </StyledToggleButton>
          <StyledToggleButton
            value="L2 Ascent"
            selected={match.endgameL2Climb!}
            sx={{
              flex: 1,
              padding: 2,
            }}
            onChange={() => {
              setMatch({
                ...match,
                endgameObservationZone: false,
                endgameL1Climb: false,
                endgameL2Climb: !match.endgameL2Climb,
                endgameL3Climb: false,
              });
            }}>
            L2 Ascent
          </StyledToggleButton>
          <StyledToggleButton
            value="L3 Ascent"
            selected={match.endgameL3Climb!}
            sx={{
              flex: 1,
              padding: 2,
            }}
            onChange={() => {
              setMatch({
                ...match,
                endgameObservationZone: false,
                endgameL1Climb: false,
                endgameL2Climb: false,
                endgameL3Climb: !match.endgameL3Climb,
              });
            }}>
            L3 Ascent
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
