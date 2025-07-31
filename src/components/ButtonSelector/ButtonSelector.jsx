import "./ButtonSelector.css";
export default function ButtonSelector({
  label,
  options,
  selectedOption,
  onSelect,
  size = "medium",
  track = true,
  fieldFormatter,
}) {
  const buttonsWithOutTrack = () => (
    <>
      {options.map((mode) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`mode-button-${size} ${
            selectedOption === mode ? "selected" : ""
          }`}
        >
          {fieldFormatter ? fieldFormatter[mode] : mode}
        </button>
      ))}
    </>
  );

  return track ? (
    <div>
      {label && <div className="button-selector-label">{label}</div>}
      <div className="mode-selector">{buttonsWithOutTrack()}</div>
    </div>
  ) : (
    <>{buttonsWithOutTrack()}</>
  );
}
