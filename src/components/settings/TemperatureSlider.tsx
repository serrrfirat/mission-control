'use client';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between min-h-[44px]">
        <span className="text-sm text-muted-foreground">Temperature</span>
        <span className="text-sm font-mono text-foreground">{value.toFixed(2)}</span>
      </div>
      <div className="px-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-border accent-accent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(167,139,113,0.3)]"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted">Precise</span>
          <span className="text-[10px] text-muted">Creative</span>
        </div>
      </div>
    </div>
  );
}
