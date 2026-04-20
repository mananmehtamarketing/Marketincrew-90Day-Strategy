import SingleSelect from "../components/SingleSelect";
import BackButton from "../components/BackButton";
import { TIMELINES } from "../types";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step8Timeline({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="space-y-5">
      <BackButton onClick={onBack} />

      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-navy)" }}
      >
        When are you looking to get started?
      </h2>

      <SingleSelect options={TIMELINES} value={value} onChange={onChange} />

      <button className="btn-primary" disabled={!value} onClick={onNext}>
        Continue
      </button>
    </div>
  );
}
