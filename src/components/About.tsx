import { SITE } from "@/data/site";

const PILLARS = [
  {
    title: "Shaxsiy menejer",
    text: "Bir kishi butun safaringiz uchun javobgar va 24/7 Telegramda aloqada.",
  },
  {
    title: "Viza va hujjatlar",
    text: "Ariza, sug'urta va bandlovlarni biz tayyorlaymiz.",
  },
  {
    title: "Tekshirilgan joylar",
    text: "Har bir mehmonxona va gidni jamoamiz o'zi sinab ko'rgan.",
  },
  {
    title: "Shaffof narx",
    text: "Yashirin to'lovlarsiz, so'm yoki dollarda to'lash mumkin.",
  },
];

export function About() {
  return (
    <section
      id="biz"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(40px,6vw,64px)] px-gutter py-section"
    >
      <div className="flex flex-col gap-4">
        <span className="text-[12px] tracking-[0.22em] text-cream/55 uppercase">
          Nima uchun Karvon
        </span>
        <h2 className="font-display m-0 text-display-sm leading-[1.05] font-medium">
          {SITE.yearsInBusiness} yildan beri sayohatni tafsilotlardan quramiz
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(28px,4vw,40px)]">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="flex flex-col gap-2.5">
            <h3 className="m-0 text-[16px] font-bold">{pillar.title}</h3>
            <p className="m-0 text-[15px] leading-[1.65] text-cream/70">
              {pillar.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
