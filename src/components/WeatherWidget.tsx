import React from 'react';
import { Sun, CloudRain, Wind, Droplets, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { WeatherData } from '../types/travel';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  destinationName: string;
  loading?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  destinationName,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="h-16 w-32 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-4 gap-2">
          <div className="h-12 bg-slate-100 rounded" />
          <div className="h-12 bg-slate-100 rounded" />
          <div className="h-12 bg-slate-100 rounded" />
          <div className="h-12 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 border border-slate-700/60 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Current Weather in {destinationName}
            </span>
            {weather.isLive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Live Data
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                <AlertCircle className="w-3 h-3" />
                Seasonal Estimate
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
              {weather.temperature}°C
            </span>
            <span className="text-base sm:text-lg font-medium text-amber-300 capitalize">
              {weather.condition}
            </span>
          </div>
        </div>

        {/* Meteorological Stats */}
        <div className="grid grid-cols-3 gap-3 bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Humidity</span>
              <span className="text-xs font-bold text-white font-mono">{weather.humidity}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Wind</span>
              <span className="text-xs font-bold text-white font-mono">{weather.windSpeed} km/h</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Rain Chance</span>
              <span className="text-xs font-bold text-white font-mono">{weather.rainProbability}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="mt-5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          7-Day Forecast
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2.5 text-center border transition-colors ${
                idx === 0
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[11px] font-bold block mb-1">
                {idx === 0 ? 'Today' : day.dayName}
              </span>
              <Sun className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <div className="text-xs font-bold text-white font-mono">
                {day.maxTemp}°
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {day.minTemp}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
