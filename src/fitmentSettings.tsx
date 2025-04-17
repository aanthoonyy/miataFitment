import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Slider,
  TextField,
  Typography,
  Divider,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

type SettingsProps = {
  updateModel: (model: any) => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ p: 1.5 }}>{children}</Box>}
    </div>
  );
}

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [tabValue, setTabValue] = useState(0);
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
    setTabValue(newValue);
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

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number,
    max: number,
    step: number,
    unit: string = ""
  ) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
        {label}: {value}
        {unit}
      </Typography>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        size="small"
      />
    </Box>
  );

  const renderNumberInput = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    placeholder: string
  ) => (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      placeholder={placeholder}
      size="small"
      sx={{ mb: 1 }}
      InputProps={{ style: { fontSize: "0.875rem" } }}
      InputLabelProps={{ style: { fontSize: "0.875rem" } }}
    />
  );

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: 120,
          bgcolor: "background.paper",
        }}
      >
        <Tab label="Front" />
        <Tab label="Rear" />
        <Tab label="Wheels" />
        <Tab label="Tires" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="subtitle1" gutterBottom>
            Front Settings
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          {renderSlider(
            "Ride Height",
            rideHeightFront,
            setRideHeightFront,
            -3,
            -2,
            0.01
          )}
          {renderSlider(
            "Camber",
            frontCamber,
            setFrontCamber,
            -20,
            1,
            0.1,
            "°"
          )}
          {renderSlider("Caster", frontCaster, setFrontCaster, 5, 8, 0.1, "°")}
          {renderSlider("Toe", frontToe, setFrontToe, -0.05, 0.05, 0.01, "°")}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="subtitle1" gutterBottom>
            Rear Settings
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          {renderSlider(
            "Ride Height",
            rideHeightRear,
            setRideHeightRear,
            -3,
            -2,
            0.01
          )}
          {renderSlider("Camber", rearCamber, setRearCamber, -20, 1, 0.1, "°")}
          {renderSlider("Toe", rearToe, setRearToe, -0.05, 0.05, 0.01, "°")}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" gutterBottom>
            Wheel Settings
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Front Wheels
              </Typography>
              {renderNumberInput(
                "Width",
                frontWheelWidth,
                setFrontWheelWidth,
                "Width (in)"
              )}
              {renderNumberInput(
                "Diameter",
                frontWheelDiameter,
                setFrontWheelDiameter,
                "Diameter (in)"
              )}
              {renderNumberInput(
                "Offset",
                frontWheelOffset,
                setFrontWheelOffset,
                "Offset (mm)"
              )}
              {renderNumberInput(
                "Spacer",
                frontWheelSpacer,
                setFrontWheelSpacer,
                "Spacer (mm)"
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Rear Wheels
              </Typography>
              {renderNumberInput(
                "Width",
                rearWheelWidth,
                setRearWheelWidth,
                "Width (in)"
              )}
              {renderNumberInput(
                "Diameter",
                rearWheelDiameter,
                setRearWheelDiameter,
                "Diameter (in)"
              )}
              {renderNumberInput(
                "Offset",
                rearWheelOffset,
                setRearWheelOffset,
                "Offset (mm)"
              )}
              {renderNumberInput(
                "Spacer",
                rearWheelSpacer,
                setRearWheelSpacer,
                "Spacer (mm)"
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="subtitle1" gutterBottom>
            Tire Settings
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Front Tires
              </Typography>
              {renderNumberInput(
                "Width",
                frontTireWidth,
                setFrontTireWidth,
                "Width (mm)"
              )}
              {renderNumberInput(
                "Sidewall",
                frontTireSidewall,
                setFrontTireSidewall,
                "Sidewall (%)"
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Rear Tires
              </Typography>
              {renderNumberInput(
                "Width",
                rearTireWidth,
                setRearTireWidth,
                "Width (mm)"
              )}
              {renderNumberInput(
                "Sidewall",
                rearTireSidewall,
                setRearTireSidewall,
                "Sidewall (%)"
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default CombinedSettings;
