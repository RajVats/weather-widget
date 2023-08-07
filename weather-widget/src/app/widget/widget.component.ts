import { Component, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environment';
import { WeatherApiService } from '../service/weather-api.service';

export interface WeekForecast {
  day?: string;
  iconPath?: string;
  max_temp: string;
  min_temp: string;
}

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WidgetComponent {
  forecast: WeekForecast[] = [];
  cityWeather!: any;

  timeZone = environment.timeZone;
  constructor(private weatherAPI: WeatherApiService) {
    this.weatherAPI.getWeatherData('Chandigarh', 'India').subscribe((x) => {
      this.cityWeather = x.data[0];
      this.cityWeather.icon = `assets/images/${x.data[0].weather.icon}.png`;
    });
    this.getLastWeeksForcast('Chandigarh', 'India');
  }

  // --------------------------API CALLS------------------------------

  getLastWeeksForcast(city: string, country: string) {
    const startEndDates = this.getDatesForTimeZone(this.timeZone);
    const obj = {
      startDate: startEndDates.startDate,
      endDate: startEndDates.endDate,
      city,
      country,
    };
    this.weatherAPI.getWeaklyData(obj).subscribe((x) => {
      x.data.forEach((y: any, i: number) => {
        const obj = {
          day: this.getDayFromDate(y.datetime),
          iconPath: `assets/images/${i + 1}.png`,
          max_temp: y.max_temp,
          min_temp: y.min_temp,
        };
        this.forecast.push(obj);
      });
    });
  }

  // -----------------CONFIGURING DATES-------------------------

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDayFromDate(dateString: any) {
    const date = new Date(dateString);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayIndex = date.getDay();
    const dayOfWeek = daysOfWeek[dayIndex];

    return dayOfWeek;
  }

  getDatesForTimeZone(timeZone: string): {
    startDate: string;
    endDate: string;
  } {
    const currentDate = new Date();
    currentDate.setHours(
      currentDate.getHours() - currentDate.getTimezoneOffset() / 60
    );

    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = currentDate;

    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
    };
  }

  // -------------------------------------------------------
}
