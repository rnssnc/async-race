import React from 'react';
import { CarStatus, RaceStatus } from '../../services/CarService';

import './CarsListItem.sass';

import ColoredCar from './ColoredCar';

type Props = {
  name: string;
  color: string;
  status: CarStatus | undefined;
  raceStatus: RaceStatus;
  driveDuration: number;
  onSelect(): void;
  onRemove(): void;
  onEngineStart(): void;
  onEngineStop(): void;
};

const CarsListItem = ({
  name,
  color,
  status,
  driveDuration,
  raceStatus,
  onSelect,
  onRemove,
  onEngineStart,
  onEngineStop,
}: Props) => {
  const isRaceStatusReady = raceStatus === RaceStatus.ready;
  const isCar = status === undefined;

  return (
    <div className="car-item">
      <div className="row">
        <div className="col car-item__actions d-flex">
          <button className="btn btn-primary" onClick={onSelect}>
            Select
          </button>
          <button className="btn btn-primary" onClick={onRemove}>
            Remove
          </button>
        </div>
        <span className="col car-item__name h3 pl-2 d-flex align-items-center">{name}</span>
        <div className="col car-item__engine-actions d-flex">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onEngineStart}
            disabled={!isCar || !isRaceStatusReady}
          >
            A
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={isCar || !isRaceStatusReady}
            onClick={onEngineStop}
          >
            B
          </button>
        </div>
      </div>
      <div className="car-item__trace-wrapper d-flex">
        <div className="car-item__trace">
          <div
            className={`car-item__car ${status === CarStatus.drive ? 'car-animate' : ''} ${
              status === CarStatus.stopped ? 'car-animate car-engine-broke' : ''
            }`}
            style={driveDuration > 0 ? { animationDuration: `${driveDuration}s` } : {}}
          >
            {ColoredCar(color)}
          </div>
        </div>
        <div className="car-item__trace-finish">
          <span className="trace-finish-caption">FINISH</span>
        </div>
      </div>
    </div>
  );
};

export default CarsListItem;
