/**
 * Onda que marca a transição entre duas faixas de cor. É o separador padrão de
 * TODAS as seções do site (no lugar da antiga linha reta).
 *
 * O SVG é sempre desenhado na cor de QUEM ESTÁ CHEGANDO:
 * - `position="top"`: fica acima da seção e sobe na faixa anterior (cor desta seção).
 * - `position="bottom"`: fica no rodapé da própria seção, com a cor da faixa seguinte.
 *
 * `line` desenha um fio fino acompanhando a curva. É o que dá o contorno da
 * separação quando as duas faixas têm a mesma cor (antes esse papel era da
 * borda reta `border-t`).
 */
export default function Wave({
  fill,
  position = "top",
  line,
  className = "",
}: {
  /** Cor da onda (a cor da faixa que está começando). */
  fill: string;
  position?: "top" | "bottom";
  /** Cor do fio que contorna a curva (ex.: "#2A2A2A"). Sem valor, não desenha. */
  line?: string;
  className?: string;
}) {
  const isTop = position === "top";
  const curva = "M0,52 C220,4 430,104 720,80 C1010,56 1210,6 1440,40";

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-x-0 h-[70px] sm:h-[100px] lg:h-[130px] overflow-hidden",
        isTop ? "bottom-full -mb-px" : "bottom-0 -mb-px",
        className,
      ].join(" ")}
    >
      <svg
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className={["w-full h-full", isTop ? "" : "-scale-x-100"].join(" ")}
      >
        <path d={`${curva} L1440,130 L0,130 Z`} style={{ fill }} />
        {line && (
          <path
            d={curva}
            fill="none"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            style={{ stroke: line }}
          />
        )}
      </svg>
    </div>
  );
}
