import { useRef } from "react";
import { useInView } from "motion/react";
import { SectionContainer } from "../../SectionContainer";

export function Title({ section: x }) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: "all",
  });

  if (!x.label.trim()) return null;

  return (
    <SectionContainer>
      {x.style === "title" 
      ? 
      (
        <div
          ref={ref}
          className="relative mb-5 mt-10 pb-3 lg:pb-5 flex justify-center"
        >
          <h1 className="text-5xl lg:text-7xl uppercase font-bold tracking-wide text-center">
            {x.label}
          </h1>

          <hr className={`absolute bottom-0 w-full border border-(--accent) transition-all duration-1000 ${inView ? "max-w-25 opacity-100" : "max-w-0 opacity-0"}`}/>
        </div>
      ) 
      : 
      (
        <div
          ref={ref}
          className="relative mb-5 mt-10 pb-5 flex justify-center"
        >
          <h1 className="text-3xl lg:text-5xl font-bold tracking-wide text-center">
            {x.label}
          </h1>
          <hr className={`absolute bottom-0 w-full border border-(--accent) transition-all duration-1000 ${inView ? "max-w-25 opacity-100" : "max-w-0 opacity-0"}`} />
        </div>
      )}
    </SectionContainer>
  );
}