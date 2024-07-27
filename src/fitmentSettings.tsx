import { useState, useEffect } from "react";
import "../src/assets/CSS/alignmentSettings.css";

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
    <div id="sliderContainer">
      <div className="input-group">
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rideHeightFront">Front Ride Height</label>
          </div>
          <input
            id="rideHeightFront"
            type="range"
            min="-3"
            max="-2"
            step="0.01"
            value={rideHeightFront}
            onChange={(e) => {
              setRideHeightFront(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rideHeightRear">Rear Ride Height</label>
          </div>
          <input
            id="rideHeightRear"
            type="range"
            min="-3"
            max="-2"
            step="0.01"
            value={rideHeightRear}
            onChange={(e) => {
              setRideHeightRear(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCamber">Front Camber</label>
            <span>{frontCamber}°</span>
          </div>
          <input
            id="frontCamber"
            type="range"
            min="-20"
            max="1"
            step="0.1"
            value={frontCamber}
            onChange={(e) => {
              setFrontCamber(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearCamber">Rear Camber</label>
            <span>{rearCamber}°</span>
          </div>
          <input
            id="rearCamber"
            type="range"
            min="-20"
            max="1"
            step="0.1"
            value={rearCamber}
            onChange={(e) => setRearCamber(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCaster">Front Caster</label>
            <span>{frontCaster}°</span>
          </div>
          <input
            id="frontCaster"
            type="range"
            min="5"
            defaultValue={5.7}
            max="8"
            step="0.1"
            value={frontCaster}
            onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontToe">Front Toe</label>
            <span>{frontToe}°</span>
          </div>
          <input
            id="frontToe"
            type="range"
            min="-0.05"
            max="0.05"
            step="0.01"
            value={frontToe}
            onChange={(e) => setFrontToe(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearToe">Rear Toe</label>
            <span>{rearToe} °</span>
          </div>
          <input
            id="rearToe"
            type="range"
            min="-0.05"
            max="0.05"
            step="0.01"
            value={rearToe}
            onChange={(e) => setRearToe(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="input-group-grid">
        <div className="input-item">
          <label htmlFor="frontTireWidth">Front Tire Width</label>
          <input
            id="frontTireWidth"
            type="number"
            min="0"
            placeholder="Width (mm)"
            value={frontTireWidth}
            onChange={(e) => setFrontTireWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearTireWidth">Rear Tire Width</label>
          <input
            id="rearTireWidth"
            type="number"
            placeholder="Spacer (mm)"
            value={rearTireWidth}
            onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="frontTireSidewall">Front Tire Sidewall</label>
          <input
            id="frontTireSidewall"
            type="number"
            min="0"
            placeholder="Sidewall (%)"
            value={frontTireSidewall}
            onChange={(e) => setFrontTireSidewall(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearTireSidewall">Rear Tire Sidewall</label>
          <input
            id="rearTireSidewall"
            type="number"
            placeholder="Spacer (mm)"
            value={rearTireSidewall}
            onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="frontWheelWidth">Front Wheel Width</label>
          <input
            id="frontWheelWidth"
            type="number"
            min="0"
            placeholder="Width (in)"
            value={frontWheelWidth}
            onChange={(e) => setFrontWheelWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearWheelWidth">Rear Wheel Width</label>
          <input
            id="rearWheelWidth"
            type="number"
            placeholder="Spacer (mm)"
            value={rearWheelWidth}
            onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="frontWheelDiameter">Front Wheel Diameter</label>
          <input
            id="frontWheelDiameter"
            type="number"
            min="0"
            placeholder="Diameter (in)"
            value={frontWheelDiameter}
            onChange={(e) => {
              setFrontWheelDiameter(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearWheelDiameter">Rear Wheel Diameter</label>
          <input
            id="rearWheelDiameter"
            type="number"
            placeholder="Spacer (mm)"
            value={rearWheelDiameter}
            onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="frontWheelOffset">Front Wheel Offset</label>
          <input
            id="frontWheelOffset"
            type="number"
            placeholder="Offset (mm)"
            value={frontWheelOffset}
            // @ts-ignore
            onChange={(e) => setFrontWheelOffset(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearWheelOffset">Rear Wheel Offset</label>
          <input
            id="rearWheelOffset"
            type="number"
            placeholder="Spacer (mm)"
            value={rearWheelOffset}
            // @ts-ignore
            onChange={(e) => setRearWheelOffset(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="frontWheelSpacer">Front Wheel Spacer</label>
          <input
            id="frontWheelSpacer"
            type="number"
            placeholder="Spacer (mm)"
            value={frontWheelSpacer}
            onChange={(e) => setFrontWheelSpacer(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="rearWheelSpacer">Rear Spacer</label>
          <input
            id="rearWheelSpacer"
            type="number"
            placeholder="Spacer (mm)"
            value={rearWheelSpacer}
            onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default CombinedSettings;
