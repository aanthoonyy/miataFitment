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
  const [rideHeight, setRideHeight] = useState(-2.51);

  const [tireWidth, setTireWidth] = useState(185);
  const [tireSidewall, setTireSidewall] = useState(55);
  const [wheelWidth, setWheelWidth] = useState(8.5);
  const [wheelDiameter, setWheelDiameter] = useState(14);
  const [wheelOffset, setWheelOffset] = useState(-7);
  const [wheelSpacer, setWheelSpacer] = useState(0);
  const [test1, setTest1] = useState(0);
  const [test2, setTest2] = useState(0);
  const [test3, setTest3] = useState(0);
  const [test4, setTest4] = useState(0);
  const [test5, setTest5] = useState(0);
  const [test6, setTest6] = useState(0);

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
      wheelSpacer,
      test1,
      test2,
      test3,
      test4,
      test5,
      test6,
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
    wheelSpacer,
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    updateModel,
  ]);

  return (
    <div id="sliderContainer">
      <div className="input-group">
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rideHeight">Front Ride Height</label>
          </div>
          <input
            id="rideHeight"
            type="range"
            min="-3"
            max="-2"
            step="0.01"
            value={rideHeight}
            onChange={(e) => {
              setRideHeight(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rideHeight">Rear Ride Height</label>
          </div>
          <input
            id="rideHeight"
            type="range"
            min="-3"
            max="-2"
            step="0.01"
            value={rideHeight}
            onChange={(e) => {
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
          <label htmlFor="test1">test1</label>
          <input
            id="test1"
            type="number"
            placeholder="Spacer (mm)"
            value={test1}
            onChange={(e) => setTest1(parseFloat(e.target.value))}
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
        <div className="input-item">
          <label htmlFor="test2">test2</label>
          <input
            id="test2"
            type="number"
            placeholder="Spacer (mm)"
            value={test2}
            onChange={(e) => setTest2(parseFloat(e.target.value))}
          />
        </div>
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
          <label htmlFor="test3">test3</label>
          <input
            id="test3"
            type="number"
            placeholder="Spacer (mm)"
            value={test3}
            onChange={(e) => setTest3(parseFloat(e.target.value))}
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
              setWheelDiameter(parseFloat(e.target.value));
            }}
          />
        </div>
        <div className="input-item">
          <label htmlFor="test4">test4</label>
          <input
            id="test4"
            type="number"
            placeholder="Spacer (mm)"
            value={test4}
            onChange={(e) => setTest4(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelOffset">Wheel Offset</label>
          <input
            id="wheelOffset"
            type="number"
            placeholder="Offset (mm)"
            value={wheelOffset}
            // @ts-ignore
            onChange={(e) => setWheelOffset(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="test5">test5</label>
          <input
            id="test5"
            type="number"
            placeholder="Spacer (mm)"
            value={test5}
            onChange={(e) => setTest5(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelSpacer">Wheel Spacer</label>
          <input
            id="wheelSpacer"
            type="number"
            placeholder="Spacer (mm)"
            value={wheelSpacer}
            onChange={(e) => setWheelSpacer(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="test6">test6</label>
          <input
            id="test6"
            type="number"
            placeholder="Spacer (mm)"
            value={test6}
            onChange={(e) => setTest6(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default CombinedSettings;
