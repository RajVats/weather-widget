import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private apiUrl = environment.weatherAPI;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}
  getWeatherData(city: string, country: string): Observable<any> {
    const url =
      this.apiUrl +
      `current?city=${city}&country=${country}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getWeaklyData(obj: any): Observable<any> {
    const url =
      this.apiUrl +
      `history/daily?city=${obj.city}&country=${obj.country}&start_date=${obj.startDate}&end_date=${obj.endDate}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
