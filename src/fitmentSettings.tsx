import * as React from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  Grid,
  Tab,
  Tabs,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { setRideHeightFront } from "./assets/buttons/getRideHeightFront";

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

interface ResponsiveSettingsPanelProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

function ResponsiveSettingsPanel({
  state,
  setState,
}: ResponsiveSettingsPanelProps) {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleTiresCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((prevState: any) => ({
      ...prevState,
      isTiresStaggered: event.target.checked,
    }));
  };

  const handleWheelsCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((prevState: any) => ({
      ...prevState,
      isWheelsStaggered: event.target.checked,
    }));
  };

  const mobileHeight = 370;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        border: "1px dashed grey",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? `${mobileHeight}px` : "30vh",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Settings Tabs"
        sx={{
          borderRight: isMobile ? 0 : 1,
          borderBottom: isMobile ? 1 : 0,
          borderColor: "divider",
          width: isMobile ? "100%" : "120px",
        }}
      >
        <Tab label="Alignment" {...a11yProps(0)} />
        <Tab label="Tires" {...a11yProps(1)} />
        <Tab label="Wheels" {...a11yProps(2)} />
      </Tabs>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TabPanel value={value} index={0}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Front Ride Height
              </Typography>
              <Slider
                value={state.rideHeightFront}
                min={-3}
                max={-2}
                step={0.01}
                aria-label="Front Ride Height"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rideHeightFront: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Rear Ride Height
              </Typography>
              <Slider
                value={state.rideHeightRear}
                min={-3}
                max={-2}
                step={0.01}
                aria-label="Rear Ride Height"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rideHeightRear: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Front Camber
              </Typography>
              <Slider
                value={state.frontCamber}
                min={-20}
                max={1}
                step={0.1}
                aria-label="Front Camber"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontCamber: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Rear Camber
              </Typography>
              <Slider
                value={state.rearCamber}
                min={-20}
                max={1}
                step={0.1}
                aria-label="Rear Camber"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearCamber: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Front Caster
              </Typography>
              <Slider
                value={state.frontCaster}
                min={5}
                max={8}
                step={0.1}
                aria-label="Front Caster"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontCaster: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Front Toe
              </Typography>
              <Slider
                value={state.frontToe}
                min={-0.05}
                max={0.05}
                step={0.01}
                aria-label="Front Toe"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontToe: newValue as number,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" gutterBottom>
                Rear Toe
              </Typography>
              <Slider
                value={state.rearToe}
                min={-0.05}
                max={0.05}
                step={0.01}
                aria-label="Rear Toe"
                valueLabelDisplay="auto"
                size="small"
                onChange={(e, newValue) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearToe: newValue as number,
                  }))
                }
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Front Tire Width"
                value={state.frontTireWidth}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontTireWidth: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Tire Width"
                value={state.rearTireWidth}
                fullWidth
                size="small"
                disabled={!state.isTiresStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearTireWidth: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Front Tire Sidewall"
                value={state.frontTireSidewall}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontTireSidewall: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Tire Sidewall"
                value={state.rearTireSidewall}
                fullWidth
                size="small"
                disabled={!state.isTiresStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearTireSidewall: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.isTiresStaggered}
                    onChange={handleTiresCheckboxChange}
                  />
                }
                label="Staggered"
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Front Wheel Width"
                value={state.frontWheelWidth}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontWheelWidth: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Wheel Width"
                value={state.rearWheelWidth}
                fullWidth
                size="small"
                disabled={!state.isWheelsStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearWheelWidth: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Front Wheel Diameter"
                value={state.frontWheelDiameter}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontWheelDiameter: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Wheel Diameter"
                value={state.rearWheelDiameter}
                fullWidth
                size="small"
                disabled={!state.isWheelsStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearWheelDiameter: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Front Wheel Offset"
                value={state.frontWheelOffset}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontWheelOffset: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Wheel Offset"
                value={state.rearWheelOffset}
                fullWidth
                size="small"
                disabled={!state.isWheelsStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearWheelOffset: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Front Wheel Spacer"
                value={state.frontWheelSpacer}
                fullWidth
                size="small"
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    frontWheelSpacer: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rear Wheel Spacer"
                value={state.rearWheelSpacer}
                fullWidth
                size="small"
                disabled={!state.isWheelsStaggered}
                onChange={(e) =>
                  setState((prevState: any) => ({
                    ...prevState,
                    rearWheelSpacer: parseFloat(e.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.isWheelsStaggered}
                    onChange={handleWheelsCheckboxChange}
                  />
                }
                label="Staggered"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default function ParentComponent() {
  const [state, setState] = React.useState({
    isTiresStaggered: false,
    isWheelsStaggered: false,
    frontCamber: -4.1,
    rearCamber: -4.1,
    frontCaster: 5,
    frontToe: 0,
    rearToe: 0,
    rideHeightFront: -2.51,
    rideHeightRear: -2.51,
    frontTireWidth: 185,
    frontTireSidewall: 55,
    frontWheelWidth: 8.5,
    frontWheelDiameter: 14,
    frontWheelOffset: -7,
    frontWheelSpacer: 5,
    rearTireWidth: 185,
    rearTireSidewall: 55,
    rearWheelWidth: 8.5,
    rearWheelDiameter: 14,
    rearWheelOffset: -7,
    rearWheelSpacer: 0,
  });

  const getRideHeightFront = () => state.rideHeightFront;
  const getRideHeightRear = () => state.rideHeightRear;

  // Here you can use the state object or export i  t as needed
  React.useEffect(() => {
    console.log("Parent Component State:", state);
    console.log("Front Ride Height:", getRideHeightFront());
    console.log("Rear Ride Height:", getRideHeightRear());
    // You can export or use the state here
    setRideHeightFront(getRideHeightFront());
  }, [state]);

  return <ResponsiveSettingsPanel state={state} setState={setState} />;
}
