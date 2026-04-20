import MultiSelect from "../components/MultiSelect";
import SkeletonChips from "../components/SkeletonChips";
import BackButton from "../components/BackButton";
import { FALLBACK_CURRENT_SETUP } from "../types";

interface Props {
  selected: string[];
  aiOptions: string[] | null;
  loading: boolean;
  onToggle: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step9CurrentSetup({
  selected,
  aiOptions,
  loading,
  onToggle,
  onNext,
  onBack,
}: Props) {
  const options =
    aiOptions && aiOptions.length > 0 ? aiOptions : FALLBACK_CURRENT_SETUP;

  return (
    <div className="space-y-5">
      <BackButton onClick={onBack} />

      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-navy)" }}
      >
        What do you currently have in place?
      </h2>
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        Select all that apply
      </p>

      {loading ? (
        <SkeletonChips />
      ) : (
        <MultiSelect options={options} selected={selected} onToggle={onToggle} />
      )}

      <button
        className="btn-primary"
        disabled={loading || selected.length === 0}
        onClick={onNext}
      >
        Submit
      </button>
    </div>
  );
}
