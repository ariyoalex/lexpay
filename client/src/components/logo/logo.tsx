import { cn } from "@/lib/utils";

export default function Logo({ classNameFull, classNameMobile }: { classNameFull?: string; classNameMobile?: string }) {
  return (
    <>
      <svg
        className={cn("fill-current", classNameFull)}
        width="100"
        height="27"
        viewBox="0 0 100 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="20"
          fontSize="18"
          fontWeight="700"
          fontFamily="Urbanist, sans-serif"
          fill="currentColor"
          letterSpacing="1"
        >
          LEXPAY
        </text>
      </svg>

      <svg
        className={cn("fill-current", classNameMobile)}
        width="22"
        height="27"
        viewBox="0 0 22 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="20"
          fontSize="16"
          fontWeight="700"
          fontFamily="Urbanist, sans-serif"
          fill="currentColor"
          letterSpacing="0.5"
        >
          L
        </text>
      </svg>
    </>
  );
}
