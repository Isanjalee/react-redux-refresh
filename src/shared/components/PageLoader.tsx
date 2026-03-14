import LoadingPanel from "./LoadingPanel";

type Props = {
  label?: string;
};

export default function PageLoader({
  label = "Loading feature...",
}: Props) {
  return (
    <div className="p-6 sm:p-8">
      <LoadingPanel
        title="Preparing the next screen"
        description={label}
      />
    </div>
  );
}
