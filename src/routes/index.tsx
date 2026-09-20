import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";

/* ------------------------------------------------------------------ *
 *  Данные страницы
 * ------------------------------------------------------------------ */

const NAV = [
  ["system", "Система"],
  ["compare", "Отличия"],
  ["pricing", "Тарифы"],
  ["faq", "Вопросы"],
] as const;

const TITLE = "DeepOF — система для запуска агентства креаторов";
const DESCRIPTION =
  "AI-инструмент для продаж в переписке, сеть подрядчиков по трафику и 11 модулей по управлению агентством в creator economy. Три формата наставничества.";

const TG_LINK = "https://t.me/deep0F";
const EMAIL = "paveldronov87@gmail.com";

const IconSale = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.6 13.4 12 22l-9-9V4h9z" />
    <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
const IconEngage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconRetain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7.5-4.6-9.3-9.2A5 5 0 0 1 12 6.4a5 5 0 0 1 9.3 5.4C19.5 16.4 12 21 12 21z" />
  </svg>
);

const SUGGESTIONS = [
  { kind: "продажа", title: "Предложить доступ", text: "В этом месяце — новая серия и закрытый эфир. Открыть доступ сейчас?", Icon: IconSale },
  { kind: "вовлечение", title: "Задать встречный вопрос", text: "Расскажу! А что тебе больше всего зашло в прошлом месяце?", Icon: IconEngage },
  { kind: "удержание", title: "Дать бонус лояльным", text: "Для тех, кто с нами давно, — бонус к подписке. Прислать детали?", Icon: IconRetain },
] as const;

const DEMO_OPTIONS = [
  { kind: "продажа", text: "Открыть доступ к новой серии", Icon: IconSale },
  { kind: "вовлечение", text: "Спросить, что зашло больше", Icon: IconEngage },
  { kind: "удержание", text: "Дать бонус за лояльность", Icon: IconRetain },
] as const;

const MODULES = [
  "Онбординг и безопасность",
  "Экономика и стратегия",
  "Поиск, отбор и закрытие модели",
  "Инфраструктура аккаунтов и упаковка",
  "Контент-конвейер",
  "Трафик",
  "Монетизация и чат",
  "Автоматизация и AI-first процессы",
  "Масштабирование",
  "Финансы, безопасность, выживание",
  "Библия системы чаттинга",
];

const COMPARE: Array<[string, string, string]> = [
  ["Опыт", "Личный опыт одного автора", "Опыт команды и выпускников прошлых потоков"],
  ["Инструмент", "Советы и теория", "Charme — включается и работает сразу"],
  ["Трафик", "Ищешь и проверяешь подрядчиков сам", "Готовая проверенная сеть по пяти направлениям"],
  ["Формат", "Записанные уроки", "Живое сопровождение команды на созвонах"],
];

const FAQ = [
  {
    q: "Нужен ли опыт для старта?",
    a: "Нет. Материалы и сеть подрядчиков рассчитаны на то, что ты начинаешь без готовых знаний о трафике и запуске.",
  },
  {
    q: "Сколько можно заработать?",
    a: "Мы не называем цифру заранее — слишком много переменных зависит от вовлечённости и модели. На созвоне разберём экономику конкретно под твою ситуацию. Мы не гарантируем доход: результат зависит от твоих действий, вложений и ситуации на рынке.",
  },
  {
    q: "Чем это отличается от других наставничеств?",
    a: "Кроме знаний, ты получаешь инструмент (Charme) и готовую сеть подрядчиков — то, что можно использовать сразу, а не только прочитать.",
  },
  {
    q: "Что если мне не подойдёт формат, который я выбрал?",
    a: "Подбор формата происходит на созвоне до оплаты — именно чтобы не ошибиться с выбором.",
  },
  {
    q: "А если я начну и пойму, что это не моё?",
    a: "Вернём деньги, если в течение недели поймёшь, что это тяжело и тебе не подходит.",
  },
];

const MARQUEE = [
  "Три варианта ответа в моменте",
  "Проверенные подрядчики по трафику",
  "11 модулей без воды",
  "Живые созвоны с командой",
  "Сопровождение после обучения",
  "7 дней гарантии",
];

/* ------------------------------------------------------------------ *
 *  Роут
 * ------------------------------------------------------------------ */

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "DeepOF — система, а не курс" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  /* --- интерфейс --- */
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqH, setFaqH] = useState<Record<number, number>>({});
  const [stickyOn, setStickyOn] = useState(false);
  const [activeNav, setActiveNav] = useState(-1);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  /* --- форма --- */
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const termRef = useRef<HTMLDivElement>(null);
  const sgRefs = useRef<Array<HTMLDivElement | null>>([]);
  const phRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const flagRef = useRef<HTMLSpanElement>(null);
  const dopRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dbarRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const termVisible = useRef(true);
  const demoVisible = useRef(false);

  const send = useServerFn(submitLead);
  const sendRef = useRef(send);
  sendRef.current = send;

  /* ---------- появление блоков при прокрутке ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    document.querySelectorAll(".rv, #h1").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ---------- свечение за курсором и пальцем ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const glow = glowRef.current;
    if (!glow) return undefined;
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".spot"));
    let x = 0;
    let y = 0;
    let queued = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const paint = () => {
      queued = false;
      glow.style.transform = `translate3d(${x}px,${y}px,0)`;
      for (const panel of panels) {
        const r = panel.getBoundingClientRect();
        if (x > r.left - 120 && x < r.right + 120 && y > r.top - 120 && y < r.bottom + 120) {
          panel.style.setProperty("--mx", `${x - r.left}px`);
          panel.style.setProperty("--my", `${y - r.top}px`);
          panel.classList.add("lit");
        } else if (panel.classList.contains("lit")) {
          panel.classList.remove("lit");
        }
      }
    };

    const move = (cx: number, cy: number) => {
      x = cx;
      y = cy;
      glow.classList.add("on");
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        glow.classList.remove("on");
        panels.forEach((p) => p.classList.remove("lit"));
      }, 2600);
    };

    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      panels.forEach((p) => p.classList.remove("lit"));
    };
  }, []);

  /* ---------- пауза анимаций за пределами экрана ---------- */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const watch = (el: HTMLElement | null, onChange: (visible: boolean) => void, threshold = 0) => {
      if (!el) return;
      const io = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { threshold });
      io.observe(el);
      observers.push(io);
    };

    watch(termRef.current, (v) => {
      termVisible.current = v;
    });
    watch(
      demoRef.current,
      (v) => {
        demoVisible.current = v;
      },
      0.25,
    );
    watch(marqueeRef.current, (v) => marqueeRef.current?.classList.toggle("paused", !v));
    watch(netRef.current, (v) => netRef.current?.classList.toggle("paused", !v));

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  /* ---------- Charme: выбирает вариант, печатает, отправляет ----------
     Пишем напрямую в DOM: посимвольная печать через состояние React
     перерисовывала бы всю страницу на каждую букву. ------------------- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const waitVisible = async () => {
      while (!cancelled && !termVisible.current) await sleep(400);
    };

    const reset = () => {
      sgRefs.current.forEach((el) => el?.classList.remove("on"));
      composerRef.current?.classList.remove("arm");
      flagRef.current?.classList.remove("on");
      if (typedRef.current) typedRef.current.textContent = "";
      if (caretRef.current) caretRef.current.style.display = "none";
      if (phRef.current) phRef.current.style.display = "";
      if (outRef.current) {
        outRef.current.style.display = "none";
        outRef.current.textContent = "";
      }
    };

    (async () => {
      let i = 0;
      while (!cancelled) {
        await waitVisible();
        if (cancelled) return;

        reset();
        await sleep(900);
        if (cancelled) return;

        const idx = i % SUGGESTIONS.length;
        const suggestion = SUGGESTIONS[idx];
        if (!suggestion) return;
        const text = suggestion.text;

        sgRefs.current[idx]?.classList.add("on");
        composerRef.current?.classList.add("arm");
        await sleep(600);
        if (cancelled) return;

        if (phRef.current) phRef.current.style.display = "none";
        if (caretRef.current && !reduce) caretRef.current.style.display = "";

        if (reduce) {
          if (typedRef.current) typedRef.current.textContent = text;
        } else {
          for (let c = 0; c < text.length; c += 1) {
            if (cancelled) return;
            if (typedRef.current) typedRef.current.textContent = text.slice(0, c + 1);
            await sleep(text.charAt(c) === " " ? 16 : 24);
          }
        }
        await sleep(700);
        if (cancelled) return;

        if (typedRef.current) typedRef.current.textContent = "";
        if (caretRef.current) caretRef.current.style.display = "none";
        if (phRef.current) phRef.current.style.display = "";
        composerRef.current?.classList.remove("arm");
        if (outRef.current) {
          outRef.current.textContent = text;
          outRef.current.style.display = "";
        }
        flagRef.current?.classList.add("on");
        await sleep(2600);
        i += 1;
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  /* ---------- мини-демо Charme в блоке «Система» ---------- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let idx = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
    };

    const tick = () => {
      if (cancelled) return;
      if (!demoVisible.current) {
        later(tick, 800);
        return;
      }
      dopRefs.current.forEach((el) => el?.classList.remove("on"));
      const bar = dbarRef.current;
      if (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
        requestAnimationFrame(() => {
          if (cancelled || !dbarRef.current) return;
          dbarRef.current.style.transition = reduce ? "none" : "width 1.1s linear";
          dbarRef.current.style.width = "100%";
        });
      }
      later(() => {
        dopRefs.current[idx % DEMO_OPTIONS.length]?.classList.add("on");
        idx += 1;
      }, reduce ? 80 : 1160);
      later(tick, 2400);
    };

    tick();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  /* ---------- нижняя полоса и подсветка активного раздела ---------- */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const hero = document.querySelector<HTMLElement>(".hero");
        const apply = document.getElementById("apply");
        if (hero && apply) {
          const heroBottom = hero.getBoundingClientRect().bottom;
          const applyTop = apply.getBoundingClientRect().top;
          setStickyOn(heroBottom < 0 && applyTop > window.innerHeight * 0.4);
        }
        const y = window.scrollY + window.innerHeight * 0.35;
        let current = -1;
        NAV.forEach(([id], i) => {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= y) current = i;
        });
        setActiveNav(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- политика конфиденциальности ---------- */
  useEffect(() => {
    if (window.location.hash === "#privacy") setPrivacyOpen(true);
  }, []);

  useEffect(() => {
    if (!privacyOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPrivacyOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [privacyOpen]);

  const toggleFaq = useCallback((i: number) => {
    const el = answerRefs.current[i];
    if (el) setFaqH((h) => ({ ...h, [i]: el.scrollHeight }));
    setOpenFaq((open) => (open === i ? null : i));
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const name = String(data.get("name") || "").trim();
      const contact = String(data.get("contact") || "").trim();
      const comment = String(data.get("comment") || "").trim();
      if (!name || !contact) {
        setFormError("Заполни имя и контакт.");
        return;
      }
      setFormError("");
      setSending(true);
      sendRef
        .current({ data: { name, contact, comment } })
        .then(() => setSent(true))
        .catch(() => setFormError("Не удалось отправить заявку. Попробуй ещё раз или напиши нам в Telegram."))
        .finally(() => setSending(false));
    },
    [],
  );

  const openPrivacy = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPrivacyOpen(true);
  }, []);

  return (
    <>
      <div id="glow" ref={glowRef} aria-hidden="true" />

      {/* ============ ШАПКА ============ */}
      <header className="hdr">
        <div className="hdr-in">
          <a href="#top" className="brand" aria-label="DeepOF — на главную">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2 2h10a10 10 0 0 1 0 20H2z" fill="#EDEDED" />
              <rect x="7" y="9" width="6" height="6" fill="#000" />
              <rect x="9" y="11" width="2" height="2" fill="#D2FF3C" />
            </svg>
            <span className="wm">
              Deep<i>OF</i>
            </span>
          </a>
          <div className="pill">
            {NAV.map(([id, label], i) => (
              <a key={id} className={`lnk ${activeNav === i ? "on" : ""}`} href={`#${id}`}>
                {label}
              </a>
            ))}
            <a className="btn btn-pill" href={TG_LINK} target="_blank" rel="noopener">
              Telegram
            </a>
            <a className="btn btn-acid btn-pill" href="#apply">
              <span className="lg-only">Оставить заявку</span>
              <span className="sm-only">Заявка</span>
            </a>
          </div>
        </div>
      </header>

      <main className="rail" id="top">
        <span className="plus tl" />
        <span className="plus tr" />

        {/* ============ ПЕРВЫЙ ЭКРАН ============ */}
        <section className="block hero">
          <div className="hero-l">
            <div className="tagline rv">
              <span className="sq" />
              DEEPOF / СИСТЕМА ДЛЯ АГЕНТСТВ КРЕАТОРОВ
            </div>
            <h1 className="rv d1" id="h1">
              Агентство креаторов —{" "}
              <span className="hl">
                <span>как система,</span>
              </span>{" "}
              а&nbsp;не&nbsp;курс.
            </h1>
            <p className="lead rv d2">
              AI-инструмент для продаж в переписке, проверенная сеть подрядчиков по трафику и структура, по которой каждый день
              работает наша команда. Не курс о том, как это делается — система, которую можно включить.
            </p>
            <div className="cta-row rv d3">
              <a className="btn btn-acid btn-lg" href="#apply">
                Оставить заявку <span className="ar">→</span>
              </a>
              <a className="btn btn-lg" href="#system">
                Что внутри <kbd>↓</kbd>
              </a>
            </div>
            <div className="meta-row rv d3">
              <span>
                от <b>$449</b>
              </span>
              <span>
                <b>11</b> модулей
              </span>
              <span>
                <b>1.5 года</b> обучения Charme
              </span>
              <span>
                <b>7 дней</b> гарантии
              </span>
            </div>
          </div>

          <div className="hero-r spot">
            <div className="term rv d2" ref={termRef}>
              <div className="term-top">
                <span>charme ~ /inbox/андрей</span>
                <span className="st">
                  <span className="d" />
                  live
                </span>
              </div>
              <div className="term-body">
                <div className="tlabel">Входящее · 21:14</div>
                <div className="msg-in">Привет! Что входит в подписку в этом месяце?</div>

                <div className="tlabel" style={{ marginTop: "16px" }}>
                  Charme предлагает 3 варианта
                </div>
                <div className="sug">
                  {SUGGESTIONS.map((s, i) => (
                    <div
                      key={s.kind}
                      className="sg"
                      ref={(el) => {
                        sgRefs.current[i] = el;
                      }}
                    >
                      <span className="ic">
                        <s.Icon />
                      </span>
                      <span className="tx">
                        <small>{s.kind}</small>
                        {s.title}
                      </span>
                      <span className="n">{i + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="composer" ref={composerRef}>
                  <span className="ph" ref={phRef}>
                    Charme подбирает ответ…
                  </span>
                  <span ref={typedRef} />
                  <span className="caret" ref={caretRef} style={{ display: "none" }} />
                </div>
                <div className="msg-out" ref={outRef} style={{ display: "none" }} />
              </div>
              <div className="term-foot">
                <span>
                  <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> выбрать
                </span>
                <span className="sent-flag" ref={flagRef}>
                  ✓ отправлено
                </span>
                <span>
                  <kbd>↵</kbd> отправить
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ БЕГУЩАЯ СТРОКА ============ */}
        <div className="block marquee" ref={marqueeRef} aria-hidden="true">
          <div className="track">
            {[...MARQUEE, ...MARQUEE].map((text, i) => (
              <span key={`${text}-${i}`}>
                <i>◆</i>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ============ 01 КТО МЫ ============ */}
        <section className="block intro spot" id="who">
          <div className="idx">
            <b>[01]</b>Кто мы
          </div>
          <div className="body">
            <h3 className="rv">Не образовательная компания по продаже инфобизнеса</h3>
            <p className="rv d1">
              У нас есть команда, которая работает в creator economy на практике: трафик, партнёрства с креаторами, продажи в
              переписке с подписчиками, экономика проектов и управление командой. Это наш основной бизнес, а не витрина для продажи
              курсов. Мы не строили карьеру вокруг обучения других. Большую часть времени нас вообще не видно — мы работаем, а не
              выступаем.
            </p>
            <p className="pull rv d2">
              DeepOF — это редкий момент, когда мы решили <span className="a">открыть часть своей системы.</span>
            </p>
          </div>
        </section>

        {/* ============ 02 ПОЧЕМУ СЕЙЧАС ============ */}
        <section className="block intro spot" id="why">
          <div className="idx">
            <b>[02]</b>Почему сейчас
          </div>
          <div className="body">
            <h3 className="rv">Почему именно сейчас</h3>
            <p className="rv d1">
              Раньше мы давали только знания. Сейчас впервые одновременно готовы все три части системы: свой инструмент для продаж
              в переписке, который дорабатывается уже полтора года; сеть проверенных подрядчиков по трафику; структура и материалы,
              по которым работает сама команда.
            </p>
            <p className="pull rv d2">
              Просто раньше система не была собрана целиком — <span className="a">а сейчас собрана.</span>
            </p>
          </div>
        </section>

        {/* ============ 03 СИСТЕМА ============ */}
        <section className="block" id="system">
          <div className="sec-head">
            <div className="idx">
              <b>[03]</b>Система
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Три части. <span className="mute">Впервые собраны вместе.</span>
              </h2>
              <p className="sub rv d1">То, чем каждый день пользуется наша команда — рабочие инструменты, а не пересказ.</p>
            </div>
          </div>
          <div className="cells">
            <article className="cell spot">
              <div className="tg">
                <span>ИНСТРУМЕНТ</span>
                <b>01</b>
              </div>
              <h3>Charme</h3>
              <p>
                AI для продаж в переписке с подписчиками. Обучен на лучших диалогах продаж и дорабатывается каждый месяц — не
                шаблонный бот с общими фразами.
              </p>
              <div className="demo" ref={demoRef}>
                <div className="din">А есть что-то для тех, кто давно подписан?</div>
                <div className="dopts">
                  {DEMO_OPTIONS.map((o, i) => (
                    <div
                      key={o.kind}
                      className="dop"
                      ref={(el) => {
                        dopRefs.current[i] = el;
                      }}
                    >
                      <span className="di">
                        <o.Icon />
                      </span>
                      <span>
                        <b>{o.kind}</b>
                        {o.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="dbar">
                  <i ref={dbarRef} style={{ width: "0%" }} />
                </div>
              </div>
              <ul>
                <li>3 варианта ответа в моменте</li>
                <li>менеджер чатов работает как сильный</li>
                <li>ранний доступ к новым функциям для VIP</li>
              </ul>
            </article>

            <article className="cell spot">
              <div className="tg">
                <span>СЕТЬ</span>
                <b>02</b>
              </div>
              <h3>Подрядчики</h3>
              <p>
                Не нужно самому разбираться в источниках трафика. Проверенные подрядчики по пяти направлениям — запуск уже завтра.
              </p>
              <div className="net" ref={netRef}>
                <svg viewBox="0 0 320 250" role="img" aria-label="Пять источников трафика сходятся в твой проект">
                  <g className="base">
                    <line x1="52" y1="40" x2="160" y2="120" />
                    <line x1="268" y1="40" x2="160" y2="120" />
                    <line x1="34" y1="150" x2="160" y2="120" />
                    <line x1="286" y1="150" x2="160" y2="120" />
                    <line x1="160" y1="225" x2="160" y2="120" />
                  </g>
                  <g>
                    <line className="flow" x1="52" y1="40" x2="160" y2="120" style={{ animationDelay: "0s" }} />
                    <line className="flow" x1="268" y1="40" x2="160" y2="120" style={{ animationDelay: ".28s" }} />
                    <line className="flow" x1="34" y1="150" x2="160" y2="120" style={{ animationDelay: ".56s" }} />
                    <line className="flow" x1="286" y1="150" x2="160" y2="120" style={{ animationDelay: ".84s" }} />
                    <line className="flow" x1="160" y1="225" x2="160" y2="120" style={{ animationDelay: "1.12s" }} />
                  </g>
                  <g>
                    <rect className="nd" x="12" y="26" width="80" height="28" rx="7" />
                    <text className="lbl" x="52" y="44" textAnchor="middle">Reddit</text>
                    <rect className="nd" x="228" y="26" width="80" height="28" rx="7" />
                    <text className="lbl" x="268" y="44" textAnchor="middle">X</text>
                    <rect className="nd" x="2" y="136" width="64" height="28" rx="7" />
                    <text className="lbl" x="34" y="154" textAnchor="middle">SFS</text>
                    <rect className="nd" x="232" y="136" width="86" height="28" rx="7" />
                    <text className="lbl" x="275" y="154" textAnchor="middle">Instagram</text>
                    <rect className="nd" x="122" y="211" width="76" height="28" rx="7" />
                    <text className="lbl" x="160" y="229" textAnchor="middle">OFTV</text>
                  </g>
                  <circle className="ring" cx="160" cy="120" r="34" />
                  <circle className="hub" cx="160" cy="120" r="32" />
                  <text className="hub-t" x="160" y="118" textAnchor="middle">ТВОЙ</text>
                  <text className="hub-t" x="160" y="130" textAnchor="middle">ПРОЕКТ</text>
                </svg>
              </div>
              <ul>
                <li>без месяцев проб и ошибок</li>
                <li>партнёрства с совершеннолетними креаторами</li>
                <li>проверено на наших проектах</li>
              </ul>
            </article>

            <article className="cell spot">
              <div className="tg">
                <span>ЗНАНИЯ</span>
                <b>03</b>
              </div>
              <h3>Структура</h3>
              <p>
                Методички, логика трафика и продаж, структура запуска — 11 полноценных модулей без воды, по которым работает сама
                команда.
              </p>
              <div className="chips">
                {MODULES.map((m, i) => (
                  <span className="chip" key={m}>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    {m}
                  </span>
                ))}
              </div>
              <ul>
                <li>живые созвоны с командой</li>
                <li>сопровождение после обучения</li>
                <li>обновляется вместе с практикой</li>
              </ul>
            </article>
          </div>
        </section>

        {/* ============ 04 ОТЛИЧИЯ ============ */}
        <section className="block" id="compare">
          <div className="sec-head">
            <div className="idx">
              <b>[04]</b>Отличия
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Не опыт одного автора. <span className="mute">Целая система.</span>
              </h2>
              <p className="sub rv d1">
                Большинство наставничеств на этом рынке — это знания и личный опыт одного человека.
              </p>
            </div>
          </div>
          <table className="cmp spot">
            <thead>
              <tr>
                <th />
                <th>Типичное наставничество</th>
                <th className="us">DeepOF</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, them, us]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="them">{them}</td>
                  <td className="us">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pad">
            <p className="pull rv">
              Мы не продаём объём информации. Мы даём то, <span className="a">чем реально пользуемся.</span>
            </p>
          </div>
        </section>

        {/* ============ 05 ОТБОР ============ */}
        <section className="block" id="selection">
          <div className="sec-head">
            <div className="idx">
              <b>[05]</b>Отбор
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Мы отбираем, <span className="mute">а не берём всех подряд.</span>
              </h2>
              <p className="sub rv d1">
                То, что зависит от нас, мы делаем полностью: даём инструмент, сеть и структуру, чтобы путь от старта до первого
                стабильного результата был короче, чем в одиночку. Дальше — твоя часть работы.
              </p>
            </div>
          </div>
          <div className="qual">
            <div className="q-col yes spot">
              <h4>Идём дальше, если</h4>
              <ul>
                <li>Готов делать, а не ждать</li>
                <li>Хочешь пройти путь быстрее и умнее, чем в одиночку</li>
                <li>Берёшь на себя часть, которая зависит от тебя</li>
              </ul>
            </div>
            <div className="q-col no spot">
              <h4>Не к нам, если</h4>
              <ul>
                <li>Ждёшь, что результат появится сам, без твоей работы</li>
                <li>Ищешь готовое решение без усилий</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ 06 ВРЕМЯ ============ */}
        <section className="block" id="time">
          <div className="sec-head">
            <div className="idx">
              <b>[06]</b>Время
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Наше время — <span className="mute">самый дорогой ресурс в этой системе.</span>
              </h2>
              <p className="sub rv d1">
                Инструмент можно включить за день, базу подрядчиков — сохранить в заметки. Но живое время команды, которое
                достаётся одному человеку, физически ограничено. Самое дорогое здесь — не Charme и не сеть. Это мы сами.
              </p>
            </div>
          </div>
          <div className="times">
            <div className="time spot">
              <div className="fig">1+1</div>
              <h4>Порог</h4>
              <p>
                Месяц обучения и ещё месяц сопровождения после него — даже на старте достаточно нашего времени, чтобы разобраться и
                не остаться один на один с первыми шагами.
              </p>
            </div>
            <div className="time spot">
              <div className="fig">3+</div>
              <h4>Доступ</h4>
              <p>
                Три месяца и больше — команда рядом на созвонах и в личных вопросах на всём пути к первому стабильному результату.
              </p>
            </div>
            <div className="time spot">
              <div className="fig">4+</div>
              <h4>Ближний круг</h4>
              <p>
                Четыре месяца и больше личного сопровождения — самый долгий и плотный контакт с командой из всех форматов.
              </p>
            </div>
          </div>
          <div className="pad">
            <p className="pull rv">
              Глубина отличается по пакетам, но даже на старте мы закладываем достаточно времени, чтобы{" "}
              <span className="a">выйти на первые результаты</span> — а не бросаем сразу после лекций.
            </p>
          </div>
        </section>

        {/* ============ 07 ТАРИФЫ ============ */}
        <section className="block" id="pricing">
          <div className="sec-head">
            <div className="idx">
              <b>[07]</b>Тарифы
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Три формата. <span className="mute">Разная глубина.</span>
              </h2>
              <p className="sub rv d1">
                Не один вариант на всех — три формата под разную задачу и разный уровень вовлечённости команды в твой запуск.
              </p>
            </div>
          </div>
          <div className="plans">
            <article className="plan spot">
              <div className="nm">
                <span>/ПОРОГ</span>
                <span>1 + 1 мес</span>
              </div>
              <h3>Порог</h3>
              <div className="pr">$449</div>
              <p className="ds">Материалы и месяц сопровождения после обучения.</p>
              <ul>
                <li>Все материалы, 11 модулей</li>
                <li>Доступ к сети подрядчиков</li>
                <li>Месяц обучения, созвон раз в неделю</li>
                <li>Ещё месяц сопровождения после обучения</li>
              </ul>
              <a className="btn btn-lg" href="#apply">
                Оставить заявку
              </a>
            </article>
            <article className="plan hot spot">
              <div className="nm">
                <span>/ДОСТУП</span>
                <span className="chipx">РЕКОМЕНДУЕМ</span>
              </div>
              <h3>Доступ</h3>
              <div className="pr t">Групповой VIP</div>
              <p className="ds">3+ месяца. Команда рядом до первого стабильного результата.</p>
              <ul>
                <li>Всё из «Порога»</li>
                <li>Два созвона в неделю с детальным разбором</li>
                <li>Сниженная цена на Charme</li>
                <li>Личные вопросы, ответ в течение суток</li>
                <li>Ранний доступ к новым функциям Charme</li>
                <li>Закрытое сообщество совладельцев агентств</li>
              </ul>
              <a className="btn btn-acid btn-lg" href="#apply">
                Узнать стоимость
              </a>
            </article>
            <article className="plan spot">
              <div className="nm">
                <span>/БЛИЖНИЙ КРУГ</span>
                <span>4+ мес</span>
              </div>
              <h3>Ближний круг</h3>
              <div className="pr t">Индивидуальный VIP</div>
              <p className="ds">Самый плотный контакт с командой из всех форматов.</p>
              <ul>
                <li>Всё из «Доступа»</li>
                <li>Индивидуальные созвоны дважды в неделю</li>
                <li>Приоритетное личное общение</li>
                <li>Три месяца поддержки в приоритете</li>
                <li>Charme: подключение + 2 месяца бесплатно</li>
              </ul>
              <a className="btn btn-w btn-lg" href="#apply">
                Узнать стоимость
              </a>
            </article>
          </div>
          <div className="p-note">
            Точную стоимость и то, какой формат подойдёт именно тебе, обсудим на созвоне — без давления, просто чтобы не тратить
            твоё время на вариант, который не подходит.
          </div>
        </section>

        <div className="block guar spot">
          <span className="n">7 ДНЕЙ</span>
          <div>
            <b>Гарантия возврата.</b> Если за первую неделю поймёшь, что это не твоё — вернём деньги, без уговоров. Мы отбираем
            участников заранее именно для того, чтобы почти никто не пользовался этим пунктом — но он есть.
          </div>
        </div>

        {/* ============ 08 ПРОЦЕСС ============ */}
        <section className="block" id="process">
          <div className="sec-head">
            <div className="idx">
              <b>[08]</b>Процесс
            </div>
            <div className="ttl">
              <h2 className="h2 rv">
                Что будет <span className="mute">после заявки.</span>
              </h2>
            </div>
          </div>
          <div className="flowr">
            <div className="stp spot">
              <div className="num">01</div>
              <p>Оставляешь заявку.</p>
            </div>
            <div className="stp spot">
              <div className="num">02</div>
              <p>Мы связываемся с тобой в течение дня.</p>
            </div>
            <div className="stp spot">
              <div className="num">03</div>
              <p>Короткий созвон — разбираемся, какой формат подходит именно тебе.</p>
            </div>
            <div className="stp spot">
              <div className="num">04</div>
              <p>Если подходим друг другу — старт обучения и доступ к материалам, сети и Charme.</p>
            </div>
          </div>
        </section>

        {/* ============ 09 ВОПРОСЫ ============ */}
        <section className="block" id="faq">
          <div className="sec-head">
            <div className="idx">
              <b>[09]</b>Вопросы
            </div>
            <div className="ttl">
              <h2 className="h2 rv">Частые вопросы</h2>
            </div>
          </div>
          <div className="faq">
            {FAQ.map((item, i) => (
              <div className="fitem" key={item.q}>
                <button
                  className="fq"
                  type="button"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => toggleFaq(i)}
                >
                  <span className="i">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item.q}</span>
                  <span className="pm" />
                </button>
                <div
                  className="fa"
                  id={`faq-a-${i}`}
                  style={{ maxHeight: openFaq === i ? `${faqH[i] ?? 400}px` : "0px" }}
                >
                  <div
                    className="inner"
                    ref={(el) => {
                      answerRefs.current[i] = el;
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 10 ЗАЯВКА ============ */}
        <section className="block apply" id="apply">
          <div className="ap-l spot">
            <div className="tagline">
              <span className="sq" />
              [10] ЗАЯВКА
            </div>
            <h2 className="big rv" style={{ marginTop: "22px" }}>
              Мы работаем.
              <br />
              Можно зайти <span className="a">вместе.</span>
            </h2>
            <p className="sub rv d1">
              Система собрана полностью впервые: инструмент, сеть, знания. Ведём ограниченное число участников одновременно —
              время команды не масштабируется. Когда места в потоке заканчиваются, набор закрывается до следующего.
            </p>
            <div className="tl rv d2">
              <div>
                <span>01</span>Оставляешь заявку
              </div>
              <div>
                <span>02</span>Связываемся в течение дня
              </div>
              <div>
                <span>03</span>Короткий созвон — подбираем формат
              </div>
              <div>
                <span>04</span>Старт: материалы, сеть и Charme
              </div>
            </div>
          </div>
          <div className="ap-r">
            {!sent && (
              <form onSubmit={onSubmit} noValidate>
                <div className="fld">
                  <label htmlFor="f-name">Имя</label>
                  <input id="f-name" name="name" placeholder="Как к тебе обращаться" autoComplete="name" />
                </div>
                <div className="fld">
                  <label htmlFor="f-contact">
                    Telegram / телефон
                  </label>
                  <input id="f-contact" name="contact" placeholder="@username" autoComplete="tel" />
                </div>
                <div className="fld">
                  <label htmlFor="f-comment">
                    Комментарий <span>опционально</span>
                  </label>
                  <textarea id="f-comment" name="comment" rows={3} />
                </div>
                <button className="btn btn-acid btn-lg" style={{ width: "100%" }} type="submit" disabled={sending}>
                  {sending ? "Отправляем…" : "Отправить заявку"} <span className="ar">→</span>
                </button>
                {formError && (
                  <p className="legal" role="alert" style={{ color: "#E2574C" }}>
                    {formError}
                  </p>
                )}
                <p className="legal">
                  Отправляя заявку, вы соглашаетесь с{" "}
                  <a href="#privacy" onClick={openPrivacy}>
                    Политикой конфиденциальности
                  </a>{" "}
                  и подтверждаете, что вам есть 18 лет.
                </p>
              </form>
            )}
            {sent && <div className="ok on">Заявка получена. Мы свяжемся с тобой в течение дня.</div>}
          </div>
          <span className="plus bl" />
          <span className="plus br" />
        </section>
      </main>

      <footer>
        <span>
          © DeepOF Mentoring · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ·{" "}
          <a href={TG_LINK} target="_blank" rel="noopener">
            @deep0F
          </a>
        </span>
        <span>
          <a href="#privacy" onClick={openPrivacy}>
            Политика конфиденциальности
          </a>
        </span>
        <span>Образовательный характер · без гарантий дохода · 18+</span>
      </footer>

      <div className={`sticky ${stickyOn ? "on" : ""}`}>
        <span className="t">
          <span className="lg-only">Три формата участия — от </span>
          <span className="sm-only">От </span>
          <b>$449</b>
        </span>
        <a className="btn btn-acid" href="#apply">
          Оставить заявку
        </a>
      </div>

      {privacyOpen && (
        <div
          className="modal on"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrivacyOpen(false);
          }}
        >
          <div className="box">
            <h3 id="privacy-title">Политика конфиденциальности DeepOF Mentoring</h3>
            <p>
              Отправляя заявку на deepof.biz.ua, вы передаёте нам имя и контакт (телефон или Telegram). Мы используем их только
              чтобы связаться с вами по заявке и рассказать о программе. Мы не продаём ваши данные третьим лицам.
            </p>
            <p>
              Сайт использует файлы cookie и пиксель Meta (Facebook/Instagram), чтобы измерять эффективность рекламы и показывать
              рекламу посетителям сайта. Meta может получать технические данные о вашем визите и действиях на сайте. Отключить
              cookie можно в настройках браузера, а рекламу — в настройках рекламы вашего аккаунта Facebook/Instagram.
            </p>
            <p>
              Данные заявок хранятся не дольше 3 лет. Чтобы узнать, какие данные у нас есть, исправить или удалить их, напишите на{" "}
              {EMAIL}. Сайт предназначен только для лиц старше 18 лет.
            </p>
            <button className="btn btn-acid" type="button" onClick={() => setPrivacyOpen(false)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
