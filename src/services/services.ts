export class Services {
    _apiBase = 'https://raw.githubusercontent.com/lastw/test-task/master/data';

    getTenBooks = async() => {
        const url = `${this._apiBase}/10-items.json`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
              `, received ${res.status}`)
          }
          return await res.json();
    }

    getThousandBooks = async() => {
        const url = `${this._apiBase}/30000-items.json`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
              `, received ${res.status}`)
          }
          return await res.json();
    }
}