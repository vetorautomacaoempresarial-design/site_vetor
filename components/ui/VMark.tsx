import Image from "next/image";

/**
 * O "V" da marca — o arquivo oficial, não um desenho aproximado.
 *
 * As brand guidelines definem DUAS versões, e só elas: a preta (versão
 * primária, para fundos claros) e a branca (adaptação para fundos escuros ou
 * coloridos). Os arquivos vivem em `public/brand/` e são cópias diretas de
 * `brand_assets/` — se a marca for atualizada, troque os PNGs e pronto.
 *
 * Nunca recolorir o logo: ele não herda `currentColor` de propósito.
 */

type VMarkVariant = "preto" | "branco";

const SRC: Record<VMarkVariant, string> = {
  preto: "/brand/logo-preto.png",
  branco: "/brand/logo-branco.png",
};

export default function VMark({
  size = 34,
  variant = "preto",
  className = "",
}: {
  /** Lado da caixa quadrada do logo, em px. O arquivo tem folga interna. */
  size?: number;
  /** "preto" = versão primária (fundo claro). "branco" = fundo escuro/colorido. */
  variant?: VMarkVariant;
  className?: string;
}) {
  return (
    <Image
      src={SRC[variant]}
      alt=""
      width={size}
      height={size}
      className={className}
      priority={false}
    />
  );
}
