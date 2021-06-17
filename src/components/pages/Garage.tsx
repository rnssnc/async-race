import React from 'react';

import CarService, {
  TCar,
  CarStatus,
  IServiceEngineData,
  RaceStatus,
} from '../../services/CarService';
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry';
import CarCreateForm from '../CarCreateForm/CarCreateForm';
import CarUpdateForm from '../CarUpdateForm/CarUpdateForm';
import CarsActions from '../CarsActions/CarsActions';
import CarsGarage from '../CarsGarage/CarsGarage';
import WinnerModalWindow from '../WinnerModalWindow/WinnerModalWindow';

const CREATE_CAR_DEFAULT_STATE = {
  value: '',
  color: '#ffffff',
};

const CAR_BRANDS_PATH = 'json/carBrands.json';
const CAR_MODELS_PATH = 'json/carModels.json';

type State = {
  currentCar: TCar | null;
  winnerCar: {
    name: string;
    time: number;
  } | null;
  isWinnerPopupShown: boolean;
  totalCarsCount: number;
  cars: TCar[];
  page: number;
  totalPagesCount: number;
  raceStatus: RaceStatus;
  isLoading: boolean;
};

interface IProps {
  isVisible: boolean;
}

export default class GaragePage extends React.Component<IProps, {}> {
  readonly CARS_TO_GENERATE = 100;
  readonly CARS_PER_PAGE = 7;

  state: State = {
    cars: [],
    currentCar: null,
    winnerCar: null,
    totalCarsCount: 0,
    page: 1,
    totalPagesCount: 0,
    raceStatus: RaceStatus.ready,
    isWinnerPopupShown: false,
    isLoading: false,
  };

  componentDidMount() {
    this.getCarsToState(this.state.page);
  }

  componentDidUpdate(_prevProps: IProps) {}

  render() {
    const {
      isLoading,
      currentCar,
      winnerCar,
      cars,
      totalCarsCount,
      page,
      totalPagesCount,
      raceStatus,
      isWinnerPopupShown,
    } = this.state;

    const { isVisible } = this.props;

    const isCarNotReady = cars.some((car) => car.status !== undefined);

    return (
      <ErrorBoundry>
        <section className={`section ${isVisible ? '' : 'page--hidden'}`}>
          <div className="car-forms-wrapper d-flex flex-wrap pt-4">
            <CarCreateForm
              raceStatus={raceStatus}
              defaultState={CREATE_CAR_DEFAULT_STATE}
              onItemSubmit={this.addCar}
            />
            <CarUpdateForm
              raceStatus={raceStatus}
              currentCar={currentCar}
              defaultState={CREATE_CAR_DEFAULT_STATE}
              value={currentCar?.name || ''}
              color={currentCar?.color || ''}
              onItemSubmit={this.updateCar}
            />
          </div>
          <CarsActions
            raceStatus={raceStatus}
            onRaceClick={this.carsRace}
            onGenerateClick={() => this.generateCars(this.CARS_TO_GENERATE)}
            onResetClick={this.carsReset}
            isLoading={isLoading || isCarNotReady}
          />
          <CarsGarage
            cars={cars}
            carsCount={totalCarsCount}
            raceStatus={raceStatus}
            page={page}
            pageCount={totalPagesCount}
            onNextPage={() => this.getCarsToState(this.state.page + 1)}
            onPrevPage={() => this.getCarsToState(this.state.page - 1)}
            onSelect={this.onSelect}
            onRemove={this.onRemove}
            onEngineStart={this.onEngineStart}
            onEngineStop={this.onEngineStop}
          />
          <WinnerModalWindow
            isShown={isWinnerPopupShown}
            carWinner={winnerCar}
            onClose={this.onWinnerModalClose}
          ></WinnerModalWindow>
        </section>
      </ErrorBoundry>
    );
  }
  onWinnerModalClose = (): void => {
    this.setState({
      isWinnerPopupShown: false,
      winnerCar: null,
    });
  };

  onEngineStop = (id: any): void => {
    CarService.stopEngine(id).then((engineData) => {
      this.setState(({ cars }: State) => {
        const newCarData = cars.map((car) => {
          if (car.id === id) {
            car.status = undefined;
            car.driveDuration = 0;
          }
          return car;
        });

        return {
          cars: newCarData,
        };
      });
    });
  };

  carsRace = () => {
    this.setState({ isLoading: true, raceStatus: RaceStatus.race });

    const enginePromises = this.state.cars.map((car) => CarService.startEngine(car.id));

    Promise.all(enginePromises).then((engineDataResponses) => {
      this.startCars(engineDataResponses);

      this.setState({ isLoading: false });

      const drivePromises = this.state.cars.map((car) => {
        return new Promise<{ id: number; success: boolean }>((resolve) =>
          CarService.drive(car.id).then((data) => {
            if (!data.success) this.stopCar(car.id);

            resolve(data);
          }),
        );
      });

      Promise.all(drivePromises).then((data) => {
        const winner = this.getWinner(data);

        if (winner) {
          CarService.saveWinner(winner.id, winner.driveDuration).then((winner) => {
            const name = this.state.cars.find((car) => car.id === winner.id)?.name;

            this.setState({
              isWinnerPopupShown: true,
              raceStatus: RaceStatus.complete,
              winnerCar: { name, time: winner.time },
            });
          });
        } else {
          this.setState({
            raceStatus: RaceStatus.complete,
            isWinnerPopupShown: true,
          });
        }
      });
    });
  };

  onEngineStart = (id: any): void => {
    CarService.startEngine(id).then((engineData) => {
      this.startCar(id, engineData);

      CarService.drive(id).then((data) => {
        if (!data.success) this.stopCar(id);
      });
    });
  };

  private getWinner(data: { id: number; success: boolean }[]) {
    const finishedCars = this.state.cars.filter((car, index) => (data[index].success ? car : null));

    if (finishedCars.length === 0) return false;

    return finishedCars.reduce((prev, curr) =>
      prev.driveDuration < curr.driveDuration ? prev : curr,
    );
  }

  private startCar(id: number, engineData: IServiceEngineData) {
    this.setState(({ cars }: State) => {
      const newCarData = cars.map((car) => {
        if (car.id === id) {
          car.status = CarStatus.drive;
          car.driveDuration = Math.round(engineData.distance / engineData.velocity) / 1000;
        }
        return car;
      });

      return {
        cars: newCarData,
      };
    });
  }

  private startCars(engineData: IServiceEngineData[]) {
    this.setState(({ cars }: State) => {
      const newCarData = cars.map((car, index) => {
        car.status = CarStatus.drive;
        car.driveDuration =
          Math.round(engineData[index].distance / engineData[index].velocity) / 1000;

        return car;
      });

      return {
        cars: newCarData,
      };
    });
  }

  carsReset = () => {
    this.setState({ isLoading: true });

    const enginePromises = this.state.cars.map((car) => CarService.stopEngine(car.id));

    Promise.all(enginePromises).then(() => {
      this.setState(({ cars }: State) => {
        const newCarData = cars.map((car) => {
          car.status = undefined;
          car.driveDuration = 0;

          return car;
        });

        return {
          raceStatus: RaceStatus.ready,
          isLoading: false,
          cars: newCarData,
        };
      });
    });
  };

  private stopCar(id: number) {
    this.setState(({ cars }: State) => {
      const newCarData = cars.map((car) =>
        car.id === id
          ? (car.status === CarStatus.drive ? (car.status = CarStatus.stopped) : null, car)
          : car,
      );

      return {
        cars: newCarData,
      };
    });
  }

  onRemove = (id: any): void => {
    Promise.all([CarService.deleteCar(id), CarService.deleteWinner(id)]).then(() =>
      this.getCarsToState(),
    );
  };

  onSelect = (car: TCar): void => {
    this.setState({
      currentCar: car,
    });
  };

  addCar = (name: string, color: string, doUpdate = true) => {
    CarService.createCar({ name, color }).then(() => {
      if (doUpdate) this.getCarsToState();
    });
  };

  updateCar = (name: string, color: string) => {
    const carName = name ? name : 'unnamed';

    if (this.state.currentCar?.id) {
      CarService.updateCar(this.state.currentCar.id, {
        name: carName,
        color,
      }).then(() => {
        this.getCarsToState();
        this.setState({
          currentCar: null,
        });
      });
    }
  };

  private generateRandomColor(): string {
    return '#' + (Math.random().toString(16) + '00000').slice(2, 8);
  }

  generateCars = (carsToGeterate: number) => {
    Promise.all([fetch(CAR_BRANDS_PATH), fetch(CAR_MODELS_PATH)]).then((responses) => {
      const resp = responses.map((response) => response.json());

      Promise.all(resp).then(([brands, models]) => {
        for (let i = 0; i < carsToGeterate; i++) {
          const randomBrand = brands[Math.floor(Math.random() * brands.length)];
          const randomModel = models[Math.floor(Math.random() * models.length)];
          const randomColor = this.generateRandomColor();

          const doUpdate = i === this.CARS_TO_GENERATE - 1;
          this.addCar(`${randomBrand} ${randomModel}`, randomColor, doUpdate);
        }
      });
    });
  };

  getCarsToState = (page = this.state.page, limit = this.CARS_PER_PAGE) => {
    CarService.getCars(page, limit).then(({ cars, count }) => {
      this.setState({
        cars,
        totalCarsCount: count,
        page,
        totalPagesCount: Math.ceil(count / limit),
      });
    });
  };
}
