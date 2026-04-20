import { ArrowLeft } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function BackButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary mb-4"
      style={{ width: "auto", padding: "0.5rem 1rem", fontSize: "0.85rem" }}
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
