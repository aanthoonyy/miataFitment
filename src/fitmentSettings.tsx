import { useState, useEffect } from "react";
import { Box, Typography, Divider, Paper, styled } from "@mui/material";

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

const CombinedSettings = ({ updateModel }: SettingsProps) => {
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

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Fitment Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Front Settings
        </Typography>
        <StyledLabel>Ride Height</StyledLabel>
        <StyledInput
          type="range"
          min="-3"
          max="-2"
          step="0.01"
          value={rideHeightFront}
          onChange={(e) => setRideHeightFront(parseFloat(e.target.value))}
        />
        <span>{rideHeightFront}</span>

        <StyledLabel>Camber</StyledLabel>
        <StyledInput
          type="range"
          min="-20"
          max="1"
          step="0.1"
          value={frontCamber}
          onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
        />
        <span>{frontCamber}°</span>

        <StyledLabel>Caster</StyledLabel>
        <StyledInput
          type="range"
          min="5"
          max="8"
          step="0.1"
          value={frontCaster}
          onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
        />
        <span>{frontCaster}°</span>

        <StyledLabel>Toe</StyledLabel>
        <StyledInput
          type="range"
          min="-0.05"
          max="0.05"
          step="0.01"
          value={frontToe}
          onChange={(e) => setFrontToe(parseFloat(e.target.value))}
        />
        <span>{frontToe}°</span>
      </StyledDiv>

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Rear Settings
        </Typography>
        <StyledLabel>Ride Height</StyledLabel>
        <StyledInput
          type="range"
          min="-3"
          max="-2"
          step="0.01"
          value={rideHeightRear}
          onChange={(e) => setRideHeightRear(parseFloat(e.target.value))}
        />
        <span>{rideHeightRear}</span>

        <StyledLabel>Camber</StyledLabel>
        <StyledInput
          type="range"
          min="-20"
          max="1"
          step="0.1"
          value={rearCamber}
          onChange={(e) => setRearCamber(parseFloat(e.target.value))}
        />
        <span>{rearCamber}°</span>

        <StyledLabel>Toe</StyledLabel>
        <StyledInput
          type="range"
          min="-0.05"
          max="0.05"
          step="0.01"
          value={rearToe}
          onChange={(e) => setRearToe(parseFloat(e.target.value))}
        />
        <span>{rearToe}°</span>
      </StyledDiv>

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
          onChange={(e) => setFrontWheelDiameter(parseFloat(e.target.value))}
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

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Rear Wheels
        </Typography>
        <StyledLabel>Width (in)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelWidth}
          onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
        />

        <StyledLabel>Diameter (in)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelDiameter}
          onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
        />

        <StyledLabel>Offset (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelOffset}
          onChange={(e) => setRearWheelOffset(parseFloat(e.target.value))}
        />

        <StyledLabel>Spacer (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearWheelSpacer}
          onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
        />
      </StyledDiv>

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

      <StyledDiv>
        <Typography variant="subtitle1" gutterBottom>
          Rear Tires
        </Typography>
        <StyledLabel>Width (mm)</StyledLabel>
        <StyledInput
          type="number"
          value={rearTireWidth}
          onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
        />

        <StyledLabel>Sidewall (%)</StyledLabel>
        <StyledInput
          type="number"
          value={rearTireSidewall}
          onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
        />
      </StyledDiv>
    </Box>
  );
};

export default CombinedSettings;
