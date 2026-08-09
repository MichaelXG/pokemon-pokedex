import { getTypeBackgroundUrl } from "@/utils/typeUtils";

interface TypeIconProps {
  typeName: string;
  size?: number;
}

export default function TypeIcon({ typeName, size = 24 }: TypeIconProps) {
  return (
    <img
      src={getTypeBackgroundUrl(typeName)}
      alt=""
      title={typeName}
      width={size}
      height={size}
      aria-hidden
      draggable={false}
    />
  );
}
