export interface ICar {
  name: string;
  color: string;
}

export interface IEngineData {
  velocity: number;
  distance: number;
}

export type TCar = {
  id: number;
  name: string;
  color: string;
  status: CarStatus | undefined;
  driveDuration: number;
};

export enum RaceStatus {
  ready = 'ready',
  race = 'race',
  complete = 'complete',
}

export type TCarWinner = {
  id: number;
  wins: number;
  time: number;
};

export type TWinner = {
  id: number;
  color: string;
  name: string;
  wins: number;
  time: number;
};

export enum CarStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}

export enum CarsWinnersSortBy {
  id = 'id',
  wins = 'wins',
  time = 'time',
}

export enum CarsWinnersOrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

type TWinnersOptions = {
  page: number;
  limit: number;
  sort: CarsWinnersSortBy;
  order: CarsWinnersOrderBy;
};

export default class CarService {
  static baseURL = 'http://localhost:3000';

  static garageURL = `${CarService.baseURL}/garage`;

  static engineURL = `${CarService.baseURL}/engine`;

  static winnersURL = `${CarService.baseURL}/winners`;

  static async getCars(page = 0, limit = 7): Promise<{ cars: TCar[]; count: number }> {
    const response = await fetch(`${CarService.garageURL}?_page=${page}&_limit=${limit}`);

    return {
      cars: await response.json(),
      count: Number(response.headers.get('X-Total-Count')),
    };
  }

  static async getCar(id: number): Promise<TCar> {
    return (await fetch(`${CarService.garageURL}/${id}`)).json();
  }

  static async deleteCar(id: number): Promise<void> {
    return (await fetch(`${CarService.garageURL}/${id}`, { method: 'DELETE' })).json();
  }

  static async createCar(car: ICar): Promise<TCar> {
    return (
      await fetch(CarService.garageURL, {
        method: 'POST',
        body: JSON.stringify(car),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  }

  static async updateCar(id: number, car: ICar): Promise<void> {
    const { color, name } = car;

    return (
      await fetch(`${CarService.garageURL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ color, name }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  }

  private static async switchEngineMode(id: number, carStatus: CarStatus) {
    return (await fetch(`${CarService.engineURL}?id=${id}&status=${carStatus}`)).json();
  }

  static startEngine(id: number): Promise<IEngineData> {
    return this.switchEngineMode(id, CarStatus.started);
  }

  static stopEngine(id: number): Promise<IEngineData> {
    return this.switchEngineMode(id, CarStatus.stopped);
  }

  static async drive(id: number): Promise<{ id: number; success: boolean }> {
    const response = await fetch(
      `${CarService.engineURL}?id=${id}&status=${CarStatus.drive}`,
    ).catch();
    return response.status !== 200 ? { id, success: false } : { id, ...(await response.json()) };
  }

  static async getWinners({
    page,
    limit,
    sort,
    order,
  }: TWinnersOptions): Promise<{ items: TCarWinner[]; count: number }> {
    const response = await fetch(
      `${this.winnersURL}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
    );

    return {
      items: await response.json(),
      count: Number(response.headers.get('X-Total-Count')),
    };
  }

  static async getWinner(id: number): Promise<TCarWinner> {
    return (await fetch(`${CarService.winnersURL}/${id}`)).json();
  }

  static async getWinnerStatus(id: number): Promise<number> {
    return (await fetch(`${CarService.winnersURL}/${id}`)).status;
  }

  static async createWinner(carWinner: TCarWinner): Promise<TCarWinner> {
    return (
      await fetch(CarService.winnersURL, {
        method: 'POST',
        body: JSON.stringify(carWinner),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  }

  static async deleteWinner(id: number): Promise<void> {
    return (await fetch(`${CarService.winnersURL}/${id}`, { method: 'DELETE' })).json();
  }

  static async updateWinner(carWinner: TCarWinner): Promise<TCarWinner> {
    const { id, wins, time } = carWinner;

    return (
      await fetch(`${CarService.winnersURL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ wins, time }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  }

  static async saveWinner(id: number, time: number): Promise<TCarWinner> {
    const status = await CarService.getWinnerStatus(id);

    if (status === 404) return await CarService.createWinner({ id, wins: 1, time });
    else {
      const winner = await CarService.getWinner(id);

      const newTime = time < winner.time ? time : winner.time;

      await CarService.updateWinner({ id, wins: ++winner.wins, time: newTime });

      return { id, wins: ++winner.wins, time };
    }
  }
}
