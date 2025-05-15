import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  styled,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

type SettingsProps = {
  updateModel: (model: any) => void;
};

const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.875rem",
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

const StyledLabel = styled("label")(({ theme }) => ({
  display: "block",
  marginBottom: "4px",
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const StyledDiv = styled("div")(({ theme }) => ({
  marginBottom: "16px",
  padding: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledSelect = styled("select")(({ theme }) => ({
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.875rem",
  backgroundColor: theme.palette.background.paper,
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

const SliderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
}));

const SliderValue = styled("span")(({ theme }) => ({
  minWidth: "60px",
  textAlign: "right",
  color: theme.palette.text.secondary,
}));

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [matchWheels, setMatchWheels] = useState(false);
  const [matchTires, setMatchTires] = useState(false);
  const [frontCamber, setFrontCamber] = useState(-4.1);
  const [rearCamber, setRearCamber] = useState(-4.1);
  const [frontCaster, setFrontCaster] = useState(5);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);
  const [rideHeightFront, setRideHeightFront] = useState(-2.51);
  const [rideHeightRear, setRideHeightRear] = useState(-2.51);

  const [frontTireWidth, setFrontTireWidth] = useState(185);
  const [frontTireSidewall, setFrontTireSidewall] = useState(55);
  const [frontWheelWidth, setFrontWheelWidth] = useState(8.5);
  const [frontWheelDiameter, setFrontWheelDiameter] = useState(14);
  const [frontWheelOffset, setFrontWheelOffset] = useState(-7);
  const [frontWheelSpacer, setFrontWheelSpacer] = useState(5);
  const [rearTireWidth, setRearTireWidth] = useState(185);
  const [rearTireSidewall, setRearTireSidewall] = useState(55);
  const [rearWheelWidth, setRearWheelWidth] = useState(8.5);
  const [rearWheelDiameter, setRearWheelDiameter] = useState(14);
  const [rearWheelOffset, setRearWheelOffset] = useState(-7);
  const [rearWheelSpacer, setRearWheelSpacer] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
      rideHeightFront,
      rideHeightRear,
      frontTireWidth,
      frontTireSidewall,
      frontWheelWidth,
      frontWheelDiameter,
      frontWheelOffset,
      frontWheelSpacer,
      rearTireWidth,
      rearTireSidewall,
      rearWheelWidth,
      rearWheelDiameter,
      rearWheelOffset,
      rearWheelSpacer,
    });
  }, [
    frontCamber,
    rearCamber,
    frontCaster,
    frontToe,
    rearToe,
    rideHeightFront,
    rideHeightRear,
    frontTireWidth,
    frontTireSidewall,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
    rearTireWidth,
    rearTireSidewall,
    rearWheelWidth,
    rearWheelDiameter,
    rearWheelOffset,
    rearWheelSpacer,
    updateModel,
  ]);

  useEffect(() => {
    if (matchWheels) {
      setRearWheelWidth(frontWheelWidth);
      setRearWheelDiameter(frontWheelDiameter);
      setRearWheelOffset(frontWheelOffset);
      setRearWheelSpacer(frontWheelSpacer);
    }
  }, [
    matchWheels,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
  ]);

  useEffect(() => {
    if (matchTires) {
      setRearTireWidth(frontTireWidth);
      setRearTireSidewall(frontTireSidewall);
    }
  }, [matchTires, frontTireWidth, frontTireSidewall]);

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Fitment Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Alignment" />
        <Tab label="Wheels" />
        <Tab label="Tires" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={rideHeightFront}
                onChange={(e) => setRideHeightFront(parseFloat(e.target.value))}
              />
              <SliderValue>{rideHeightFront}</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={frontCamber}
                onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Caster:</StyledLabel>
              <StyledInput
                type="range"
                min="5"
                max="8"
                step="0.1"
                value={frontCaster}
                onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCaster}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={frontToe}
                onChange={(e) => setFrontToe(parseFloat(e.target.value))}
              />
              <SliderValue>{frontToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Rear Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={rideHeightRear}
                onChange={(e) => setRideHeightRear(parseFloat(e.target.value))}
              />
              <SliderValue>{rideHeightRear}</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={rearCamber}
                onChange={(e) => setRearCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{rearCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={rearToe}
                onChange={(e) => setRearToe(parseFloat(e.target.value))}
              />
              <SliderValue>{rearToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>
        </>
      )}

      {activeTab === 1 && (
        <>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={matchWheels}
                  onChange={(e) => setMatchWheels(e.target.checked)}
                />
              }
              label="Match Front and Rear Wheels"
            />
          </Box>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Wheels
            </Typography>
            <StyledLabel>Width (in)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelWidth}
              onChange={(e) => setFrontWheelWidth(parseFloat(e.target.value))}
            />

            <StyledLabel>Diameter (in)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelDiameter}
              onChange={(e) =>
                setFrontWheelDiameter(parseFloat(e.target.value))
              }
            />

            <StyledLabel>Offset (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelOffset}
              onChange={(e) => setFrontWheelOffset(parseFloat(e.target.value))}
            />

            <StyledLabel>Spacer (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelSpacer}
              onChange={(e) => setFrontWheelSpacer(parseFloat(e.target.value))}
            />
          </StyledDiv>

          <StyledDiv sx={{ opacity: matchWheels ? 0.5 : 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rear Wheels {matchWheels && "(Matching Front)"}
            </Typography>
            <StyledLabel>Width (in)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelWidth}
              onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Diameter (in)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelDiameter}
              onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Offset (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelOffset}
              onChange={(e) => setRearWheelOffset(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Spacer (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelSpacer}
              onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
              disabled={matchWheels}
            />
          </StyledDiv>
        </>
      )}

      {activeTab === 2 && (
        <>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={matchTires}
                  onChange={(e) => setMatchTires(e.target.checked)}
                />
              }
              label="Match Front and Rear Tires"
            />
          </Box>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Tires
            </Typography>
            <StyledLabel>Width (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontTireWidth}
              onChange={(e) => setFrontTireWidth(parseFloat(e.target.value))}
            />

            <StyledLabel>Sidewall (%)</StyledLabel>
            <StyledInput
              type="number"
              value={frontTireSidewall}
              onChange={(e) => setFrontTireSidewall(parseFloat(e.target.value))}
            />
          </StyledDiv>

          <StyledDiv sx={{ opacity: matchTires ? 0.5 : 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rear Tires {matchTires && "(Matching Front)"}
            </Typography>
            <StyledLabel>Width (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearTireWidth}
              onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
              disabled={matchTires}
            />

            <StyledLabel>Sidewall (%)</StyledLabel>
            <StyledInput
              type="number"
              value={rearTireSidewall}
              onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
              disabled={matchTires}
            />
          </StyledDiv>
        </>
      )}
    </Box>
  );
};

export default CombinedSettings;
