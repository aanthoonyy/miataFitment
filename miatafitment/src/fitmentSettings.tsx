import React, { useState, useEffect } from "react";
import "../src/assets/CSS/alignmentSettings.css";

type SettingsProps = {
  updateModel: (model: any) => void;
};

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [frontCamber, setFrontCamber] = useState(-4);
  const [rearCamber, setRearCamber] = useState(-4.1);
  const [frontCaster, setFrontCaster] = useState(5);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);
  const [rideHeight, setRideHeight] = useState(-2.51);

  const [tireWidth, setTireWidth] = useState(185);
  const [tireSidewall, setTireSidewall] = useState(55);
  const [wheelWidth, setWheelWidth] = useState(8.5);
  const [wheelDiameter, setWheelDiameter] = useState(14);
  const [wheelOffset, setWheelOffset] = useState(-7);

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
      rideHeight,
      tireWidth,
      tireSidewall,
      wheelWidth,
      wheelDiameter,
      wheelOffset,
    });
  }, [
    frontCamber,
    rearCamber,
    frontCaster,
    frontToe,
    rearToe,
    rideHeight,
    tireWidth,
    tireSidewall,
    wheelWidth,
    wheelDiameter,
    wheelOffset,
    updateModel,
  ]);

  return (
    <div id="sliderContainer">
      <div className="input-group">
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rideHeight">Ride Height</label>
            <span>{rideHeight} mm</span>
          </div>
          <input
            id="rideHeight"
            type="range"
            min="-3.5"
            max="2"
            step="0.01"
            value={rideHeight}
            onChange={(e) => {
              console.log("New rideHeight:", e.target.value);
              setRideHeight(parseFloat(e.target.value));
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
              console.log("New frontCamber:", e.target.value);
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
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="tireWidth">Tire Width</label>
          <input
            id="tireWidth"
            type="number"
            min="0"
            placeholder="Width (mm)"
            value={tireWidth}
            onChange={(e) => setTireWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="tireSidewall">Tire Sidewall</label>
          <input
            id="tireSidewall"
            type="number"
            min="0"
            placeholder="Sidewall (%)"
            value={tireSidewall}
            onChange={(e) => setTireSidewall(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="wheelWidth">Wheel Width</label>
          <input
            id="wheelWidth"
            type="number"
            min="0"
            placeholder="Width (in)"
            value={wheelWidth}
            onChange={(e) => setWheelWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelDiameter">Wheel Diameter</label>
          <input
            id="wheelDiameter"
            type="number"
            min="0"
            placeholder="Diameter (in)"
            value={wheelDiameter}
            onChange={(e) => {
              console.log("New rideHeight:", e.target.value);
              setWheelDiameter(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelOffset">Wheel Offset</label>
          <input
            id="wheelOffset"
            type="number"
            placeholder="Offset (mm)"
            value={wheelOffset}
            onChange={(e) => setWheelOffset(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CombinedSettings;
