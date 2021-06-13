import React from 'react';
import { RaceStatus, TCar } from '../../services/CarService';
import CarsList from '../CarsList/CarsList';
import Pagination from '../Pagination/Pagination';

interface IProps {
  cars: TCar[];
  carsCount: number;
  page: number;
  pageCount: number;
  raceStatus: RaceStatus;
  onNextPage(): void;
  onPrevPage(): void;
  onSelect(car: TCar): void;
  onRemove(id: number): void;
  onEngineStart(id: number): void;
  onEngineStop(id: number): void;
}

export default class CarsGarage extends React.Component<IProps, {}> {
  render() {
    const {
      cars,
      page,
      pageCount,
      carsCount,
      raceStatus,
      onNextPage,
      onPrevPage,
      onSelect,
      onRemove,
      onEngineStart,
      onEngineStop,
    } = this.props;

    const isRaceStatusReady = raceStatus === RaceStatus.ready;

    return (
      <section className="section garage-section pt-5">
        <div className="garage-section__heading-pagination-wrapper d-flex align-items-center">
          <h2 className="garage-section__heading mb-0">Garage ({carsCount ? carsCount : 0})</h2>
          <Pagination
            isLocked={!isRaceStatusReady}
            page={page}
            pageCount={pageCount}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
          />
        </div>
        <CarsList
          raceStatus={raceStatus}
          cars={cars}
          onSelect={onSelect}
          onRemove={onRemove}
          onEngineStart={onEngineStart}
          onEngineStop={onEngineStop}
        />
      </section>
    );
  }
}
