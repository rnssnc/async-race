import React from 'react';
import { RaceStatus } from '../../services/CarService';

import './CarsActions.sass';

type IProps = {
  raceStatus: RaceStatus;
  isLoading: boolean;
  onRaceClick(): void;
  onResetClick(): void;
  onGenerateClick(): void;
};

const carsActions = (props: IProps) => {
  const { isLoading, raceStatus, onRaceClick, onResetClick, onGenerateClick } = props;

  const isRaceDone = !(raceStatus === RaceStatus.complete);
  const isRaceReady = !(raceStatus === RaceStatus.ready);

  return (
    <div className="cars-actions-wrapper  d-flex pt-3">
      <button
        className="col btn btn-outline-primary"
        disabled={isRaceReady || isLoading}
        onClick={onRaceClick}
      >
        Race
      </button>
      <button
        className="col btn btn-outline-primary"
        disabled={isRaceDone || isLoading}
        onClick={onResetClick}
      >
        Reset
      </button>
      <button
        className="col btn btn-outline-primary"
        disabled={isRaceReady || isLoading}
        onClick={onGenerateClick}
      >
        Generate Cars
      </button>
    </div>
  );
};

export default carsActions;
