import { useState, useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Container, Slider, TextField, Typography } from "@mui/material";
import { marks } from "./assets/common/fitmentSettingsHelper";

type SettingsProps = {
  updateModel: (model: any) => void;
};

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
      rideHeight: rideHeightFront,
      rideHeightRear,
      tireWidth: frontTireWidth,
      tireSidewall: frontTireSidewall,
      wheelWidth: frontWheelWidth,
      wheelDiameter: frontWheelDiameter,
      wheelOffset: frontWheelOffset,
      wheelSpacer: frontWheelSpacer,
      test1: rearTireWidth,
      test2: rearTireSidewall,
      test3: rearWheelWidth,
      test4: rearWheelDiameter,
      test5: rearWheelOffset,
      test6: rearWheelSpacer,
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
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Front Ride Height
              </Typography>
              <Slider
                size="small"
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Rear Ride Height
              </Typography>
              <Slider
                size="small"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Front Camber
              </Typography>
              <Slider
                size="small"
                aria-label="Default"
                valueLabelDisplay="auto"
                defaultValue={0}
                min={-20}
                max={20}
                marks={marks}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Rear Camber
              </Typography>
              <Slider
                size="small"
                aria-label="Default"
                valueLabelDisplay="auto"
                defaultValue={0}
                min={-20}
                max={20}
                marks={marks}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Front Toe
              </Typography>
              <Slider
                size="small"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Rear Toe
              </Typography>
              <Slider
                size="small"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" gutterBottom>
                Front Caster
              </Typography>
              <Slider
                size="small"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Tire Width
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Tire Width"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Ride Width
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Tire Width"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Tire Sidewall
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Tire Sidewall"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Tire Sidewall
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Tire Sidewall"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Wheel Width
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Wheel Width"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Wheel Width
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Wheel Width"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Wheel Diameter
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Wheel Diameter"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Wheel Diameter
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Wheel Diameter"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Wheel Offset
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Wheel Offset"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Wheel Offset
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Wheel Offset"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Front Wheel Spacer
              </Typography>
              <TextField
                id="outlined-basic"
                label="Front Wheel Spacer"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" gutterBottom>
                Rear Wheel Spacer
              </Typography>
              <TextField
                id="outlined-basic"
                label="Rear Wheel Spacer"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CombinedSettings;
