interface SpecSectionProps {
  title: string;
  rows: { label: string; value: string | number | null | undefined }[];
}

export default function SpecSection({ title, rows }: SpecSectionProps) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-4 tracking-wide">{title}</h3>

      <div className="border border-white/20 rounded-lg overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 px-4 py-2 text-sm border-b border-white/10 last:border-none"
          >
            <span className="opacity-70">{row.label}</span>
            <span className="text-right">{row.value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
