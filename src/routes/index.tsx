import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
const tabs = [["who","Кто мы"],["why-now","Почему"],["inside","Внутри"],["difference","Отличия"],["selection","Отбор"],["commitment","Время"],["pricing","Тарифы"],["process","Процесс"],["faq","Вопросы"],["final","Заявка"]] as const;
export const Route=createFileRoute("/")({head:()=>({meta:[{title:"DeepOF — система для запуска агентства креаторов"},{name:"description",content:"AI-инструмент для продаж в переписке, сеть подрядчиков по трафику и 11 модулей по управлению агентством в creator economy. Три формата наставничества."},{property:"og:title",content:"DeepOF — система, а не курс"},{property:"og:description",content:"AI-инструмент для продаж в переписке, сеть подрядчиков по трафику и 11 модулей по управлению агентством в creator economy. Три формата наставничества."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Index});
function Index(){const [active,setActive]=useState("who");const [sticky,setSticky]=useState(false);const [sending,setSending]=useState(false);const [formError,setFormError]=useState("");const [privacyOpen,setPrivacyOpen]=useState(false);const send=useServerFn(submitLead);const sendRef=useRef(send);sendRef.current=send;useEffect(()=>{const checkHash=()=>setPrivacyOpen(location.hash==="#privacy");checkHash();addEventListener("hashchange",checkHash);return()=>removeEventListener("hashchange",checkHash)},[]);useEffect(()=>{document.body.classList.add("loaded");const qs=[...document.querySelectorAll<HTMLButtonElement>(".faq-question")];const cleanups=qs.map(btn=>{const click=()=>{const expanded=btn.getAttribute("aria-expanded")==="true";qs.forEach(other=>{other.setAttribute("aria-expanded","false");document.getElementById(other.getAttribute("aria-controls")||"")?.classList.remove("open")});if(!expanded){btn.setAttribute("aria-expanded","true");document.getElementById(btn.getAttribute("aria-controls")||"")?.classList.add("open")}};btn.addEventListener("click",click);return()=>btn.removeEventListener("click",click)});const form=document.getElementById("applyForm") as HTMLFormElement|null;const submit=(e:Event)=>{e.preventDefault();if(!form)return;const fd=new FormData(form);const name=String(fd.get("name")||"").trim();const contact=String(fd.get("contact")||"").trim();const comment=String(fd.get("comment")||"").trim();if(!name||!contact){setFormError("Заполни имя и контакт.");return}setFormError("");setSending(true);sendRef.current({data:{name,contact,comment}}).then(()=>{form.classList.add("hidden");document.getElementById("formSuccess")?.classList.add("visible")}).catch(()=>{setFormError("Не удалось отправить заявку. Попробуй ещё раз или напиши нам в Telegram.")}).finally(()=>setSending(false))};form?.addEventListener("submit",submit);const scroll=()=>{const sections=tabs.map(([id])=>document.getElementById(id)).filter((x):x is HTMLElement=>Boolean(x));let current=sections[0];const y=scrollY+innerHeight*.35;sections.forEach(x=>{if(x.offsetTop<=y)current=x});if(current)setActive(current.id);const hero=document.getElementById("hero-section"),fs=document.getElementById("form");if(hero&&fs)setSticky(hero.getBoundingClientRect().bottom<0&&fs.getBoundingClientRect().top>innerHeight*.2)};addEventListener("scroll",scroll,{passive:true});scroll();return()=>{cleanups.forEach(f=>f());form?.removeEventListener("submit",submit);removeEventListener("scroll",scroll);document.body.classList.remove("loaded")}},[]);return <><div className="noise" aria-hidden="true"/><nav className="file-tabs" aria-label="Разделы страницы">{tabs.map(([id,label])=><a key={id} className={`tab ${active===id?"active":""}`} href={`#${id}`}>{label}</a>)}</nav>



<main>
<div className="wrap">
  <header>
    <div className="mark">Deep<span>OF</span></div>
    <div className="header-right">
      <a href="https://t.me/+IgSSjYF2dXM2NzRi" target="_blank" rel="noopener" className="header-tg">Telegram</a>
      <a href="#form" className="btn btn-outline btn-small">Оставить заявку</a>
    </div>
  </header>

  
  <section className="no-border hero-section" id="hero-section">
    <div className="hero-main">
      <span className="stamp">Система · закрытый доступ</span>
      <p className="kicker">Открываем часть системы</p>
      <h1>Мы ведём агентство креаторов каждый день. Теперь открываем доступ к полной практической системе, а не только к знаниям.</h1>
      <p className="hero-lead">DeepOF — это свой AI-инструмент для продаж в переписке, проверенная сеть подрядчиков по трафику и структура, по которой работает наша команда. Не курс о том, как это делается. Система, которую можно включить.</p>
      <div className="hero-cta">
        <a href="#inside" className="btn">Узнать, что внутри</a>
      </div>
      <p className="hero-micro">Три формата участия — от <span className="fig">$449</span></p>
    </div>

    <div className="stat-strip">
      <div><div className="stat-num">$449</div><div className="stat-label">Старт, три формата</div></div>
      <div><div className="stat-num">11</div><div className="stat-label">Модулей знаний</div></div>
      <div><div className="stat-num">1.5 года</div><div className="stat-label">Charme в разработке</div></div>
    </div>

    <div className="hero-flow">
      <div className="flow" aria-hidden="true">
        <span className="flow-step key">Charme</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">Сеть подрядчиков</span>
        <span className="flow-arrow">→</span>
        <span className="flow-step">Структура и знания</span>
      </div>
    </div>
  </section>

  
  <section className="intro" id="who">
    <div className="head">
      <div className="sec-num">01</div>
      <h2>Не образовательная компания по продаже инфобизнеса</h2>
    </div>
    <div className="body">
      <p>У нас есть команда, которая работает в creator economy на практике: трафик, партнёрства с креаторами, продажи в переписке с подписчиками, экономика проектов и управление командой. Это наш основной бизнес, а не витрина для продажи курсов. Мы не строили карьеру вокруг обучения других. Большую часть времени нас вообще не видно — мы работаем, а не выступаем.</p>
      <p className="pull">DeepOF — это редкий момент, когда мы решили открыть часть своей системы.</p>
    </div>
  </section>

  
  <section className="intro" id="why-now">
    <div className="head">
      <div className="sec-num">02</div>
      <h2>Почему именно сейчас</h2>
    </div>
    <div className="body">
      <p>Раньше мы давали только знания. Сейчас — впервые одновременно готовы все три части системы: свой инструмент для продаж внутри переписки, который дорабатывается уже полтора года; сеть проверенных подрядчиков по трафику и моделям; структура и материалы, по которым работает сама команда.</p>
      <p className="pull">Просто раньше система не была собрана целиком — а сейчас собрана.</p>
    </div>
  </section>

  
  <section id="inside">
    <div className="pillars-head">
      <div className="sec-num">03</div>
      <h2>Система, а не курс</h2>
    </div>

    <div className="charme-showcase">
      <div className="charme-copy">
        <span className="pillar-tag">Инструмент</span>
        <h3>Charme</h3>
        <p>Наш собственный AI-инструмент для продаж в переписке с подписчиками. Он обучен на лучших диалогах продаж полтора года и продолжает дорабатываться каждый месяц. Сейчас Charme выдаёт три варианта ответа в моменте переписки — менеджер чатов видит все пути сразу и может выбрать неочевидный.</p>

        <div className="mock" aria-hidden="true">
          <div className="mock-bar"><span className="live"></span><span></span><span></span><span className="mock-title">Charme</span></div>
          <div className="mock-label">Входящее сообщение</div>
          <div className="mock-msg-in">Привет! Что входит в подписку в этом месяце?</div>
          <div className="mock-label">Charme предлагает 3 варианта</div>
          <div className="mock-replies">
            <div className="mock-reply"><span>Продажа</span><span className="tag">01</span></div>
            <div className="mock-reply"><span>Вовлечение</span><span className="tag">02</span></div>
            <div className="mock-reply"><span>Удержание</span><span className="tag">03</span></div>
          </div>
        </div>
      </div>

      <div className="feat-list">
        <div className="feat-item">
          <div className="feat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v6M12 10l-6 4M12 10l6 4M12 10v10"/></svg>
          </div>
          <div><h4>Три варианта ответа сразу</h4><p>В любой момент переписки Charme показывает три пути — можно выбрать неочевидный, а не первый попавшийся.</p></div>
        </div>
        <div className="feat-item">
          <div className="feat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>
          </div>
          <div><h4>Полтора года на живых чатах</h4><p>Обучен на топовых переписках и дорабатывается каждый месяц — не шаблонный бот с общими фразами.</p></div>
        </div>
        <div className="feat-item">
          <div className="feat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19V13M12 19V9M19 19V5"/></svg>
          </div>
          <div><h4>Средний менеджер чатов работает как профи</h4><p>Двое средних менеджеров чатов с Charme — как два сильных. Инструмент поднимает уровень, а не заменяет решение.</p></div>
        </div>
        <div className="feat-item">
          <div className="feat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="10" height="4" rx="1"/></svg>
          </div>
          <div><h4>Скоро — три стиля ответа</h4><p>Продажа, вовлечение, удержание: каждый из трёх вариантов получит собственный стиль.</p></div>
        </div>
        <div className="feat-item">
          <div className="feat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.2 4.8 5.3.6-4 3.6 1.1 5.2L12 14.9l-4.6 2.3 1.1-5.2-4-3.6 5.3-.6z"/></svg>
          </div>
          <div><h4>Ранний доступ участникам VIP</h4><p>Групповой и индивидуальный форматы получают каждую новую функцию Charme раньше остальных.</p></div>
        </div>
      </div>
    </div>

    <div className="pillar-grid pillar-grid--secondary">
      <div className="pillar-card">
        <svg className="pillar-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <line x1="24" y1="22" x2="10" y2="36"/>
          <line x1="24" y1="22" x2="38" y2="36"/>
          <line x1="24" y1="22" x2="24" y2="8"/>
          <circle cx="24" cy="22" r="3"/>
          <circle cx="10" cy="36" r="3"/>
          <circle cx="38" cy="36" r="3"/>
          <circle cx="24" cy="8" r="3"/>
        </svg>
        <span className="pillar-tag">Сеть</span>
        <h3>Сеть подрядчиков</h3>
        <p>Не нужно самостоятельно разбираться в трафике из Reddit, X и кросс-промо, чтобы начать. У нас есть проверенные подрядчики, с которыми можно запускать трафик уже завтра. То же с партнёрствами: знаем, где находить совершеннолетних креаторов, готовых к сотрудничеству.</p>
      </div>

      <div className="pillar-card">
        <svg className="pillar-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <line x1="6" y1="14" x2="42" y2="14"/>
          <line x1="6" y1="24" x2="32" y2="24"/>
          <line x1="6" y1="34" x2="38" y2="34"/>
        </svg>
        <span className="pillar-tag">Знания</span>
        <h3>Структура и знания</h3>
        <p>Всё, чем пользуется сама команда: методички, логика трафика и продаж, структура запуска — разложено по 11 полноценным модулям, без воды.</p>
      </div>
    </div>
  </section>

  
  <section id="difference">
    <div className="pillars-head">
      <div className="sec-num">04</div>
      <h2>Чем это отличается</h2>
      <p className="top-note">Большинство наставничеств на этом рынке — это знания и личный опыт одного автора. У нас, кроме личного опыта команды, есть:</p>
    </div>

    <div className="usp-grid">
      <div className="usp-card">
        <div className="usp-index">01</div>
        <strong>Опыт выпускников</strong>
        <p>Опыт прошлых потоков, которые получали и продолжают получать результат.</p>
      </div>
      <div className="usp-card">
        <div className="usp-index">02</div>
        <strong>Готовый инструмент</strong>
        <p>Charme можно включить и начать использовать сразу, а не только прочитать о нём.</p>
      </div>
      <div className="usp-card">
        <div className="usp-index">03</div>
        <strong>Готовая сеть</strong>
        <p>Избавляет от месяцев проб и ошибок в трафике.</p>
      </div>
    </div>
    <p className="pull">Мы не продаём объём информации. Мы даём то, чем реально пользуемся.</p>
  </section>

  
  <section id="selection">
    <div className="pillars-head">
      <div className="sec-num">05</div>
      <h2>Мы отбираем, а не берём всех подряд</h2>
      <p className="top-note">Мы работаем не с каждым, кто оставил заявку. То, что зависит от нас, мы делаем полностью: даём инструмент, сеть и структуру, чтобы путь от старта до первого стабильного результата был короче, чем если бы ты проходил его в одиночку. Дальше — твоя часть работы.</p>
    </div>

    <div className="qualify-grid">
      <div className="qualify-col yes">
        <h4>Идём дальше, если</h4>
        <ul>
          <li>Готов делать, а не ждать</li>
          <li>Хочешь пройти путь быстрее и умнее, чем в одиночку</li>
          <li>Берёшь на себя часть, которая зависит от тебя</li>
        </ul>
      </div>
      <div className="qualify-col no">
        <h4>Не к нам, если</h4>
        <ul>
          <li>Ждёшь, что результат появится сам, без твоей работы</li>
          <li>Ищешь готовое решение без усилий</li>
        </ul>
      </div>
    </div>
  </section>

  
  <section id="commitment">
    <div className="pillars-head">
      <div className="sec-num">06</div>
      <h2>Наше время — самый дорогой ресурс в этой системе</h2>
      <p className="top-note">Инструмент можно включить за один день. Базу подрядчиков — сохранить в заметки. Но живое время команды, которое достаётся одному человеку, физически ограничено — его нельзя размножить. Из всего, что входит в систему, самое дорогое — не Charme и не сеть. Это мы сами.</p>
    </div>

    <div className="duration-grid">
      <div className="duration-card">
        <div className="duration-figure">1 + 1</div>
        <h4>Порог</h4>
        <p>Месяц обучения и ещё месяц сопровождения после него — даже на старте достаточно нашего времени, чтобы разобраться и не остаться один на один с первыми шагами.</p>
      </div>
      <div className="duration-card">
        <div className="duration-figure">3+</div>
        <h4>Доступ</h4>
        <p>Три месяца и больше — команда рядом на созвонах и в личных вопросах на всём пути к первому стабильному результату.</p>
      </div>
      <div className="duration-card">
        <div className="duration-figure">4+</div>
        <h4>Ближний круг</h4>
        <p>Четыре месяца и больше личного сопровождения — самый долгий и плотный контакт с командой из всех форматов.</p>
      </div>
    </div>

    <p className="pull">Глубина и частота отличаются по пакетам, но даже на старте мы закладываем достаточно времени, чтобы по-настоящему разобраться и выйти на первые результаты — а не бросаем сразу после лекций.</p>
  </section>

  
  <section id="guarantee">
    <div className="guarantee-box">
      <div><div className="guarantee-seal"><b>7</b>дней<br />гарантии</div></div>
      <div>
        <h3>Если за первую неделю поймёшь, что это не твоё — вернём деньги</h3>
        <p>Без уговоров. Мы отбираем участников заранее именно для того, чтобы почти никто не пользовался этим пунктом — но он есть.</p>
      </div>
    </div>
  </section>

  
  <section id="pricing">
    <div className="pricing-head">
      <div className="sec-num">07</div>
      <h2>Три формата — разная вовлечённость</h2>
      <p className="top-note">Не один вариант на всех. Три формата под разную задачу и разный уровень вовлечённости команды в твой запуск.</p>
    </div>

    <div className="pricing-grid">
      <div className="price-card">
        <span className="duration-tag">1 + 1 месяц</span>
        <h3>Порог</h3>
        <p className="price-figure">от $449</p>
        <ul className="plain">
          <li>Материалы</li>
          <li>Доступ к сети подрядчиков</li>
          <li>Месяц обучения с еженедельными созвонами</li>
          <li>Ещё месяц сопровождения после обучения — не остаёшься один на один с первыми результатами</li>
        </ul>
        <p className="price-note">Даже на старте у тебя достаточно нашего времени, чтобы разобраться и выйти на первые результаты.</p>
        <a href="#form" className="btn btn-outline">Оставить заявку</a>
      </div>

      <div className="price-card highlight">
        <div className="price-tags">
          <span className="price-tag">Рекомендуем большинству</span>
          <span className="duration-tag">3+ месяца</span>
        </div>
        <h3>Доступ</h3>
        <p className="price-figure muted">Групповой VIP</p>
        <ul className="plain">
          <li>Всё из «Порога»</li>
          <li>Два созвона в неделю с детальным разбором проблем</li>
          <li>Сниженная цена на Charme</li>
          <li>Личные вопросы в течение двух месяцев, ответ в течение суток</li>
          <li>Ранний доступ к новым функциям Charme</li>
          <li>Доступ в закрытое сообщество совладельцев агентств, которые давно на рынке</li>
        </ul>
        <a href="#form" className="btn">Узнать стоимость</a>
      </div>

      <div className="price-card">
        <span className="duration-tag">4+ месяца</span>
        <h3>Ближний круг</h3>
        <p className="price-figure muted">Индивидуальный VIP</p>
        <ul className="plain">
          <li>Всё из «Доступа»</li>
          <li>Индивидуальные созвоны дважды в неделю</li>
          <li>Приоритетное личное общение</li>
          <li>Три месяца поддержки в приоритете</li>
          <li>Бесплатное подключение Charme и два месяца бесплатного использования</li>
          <li>Доступ в закрытое сообщество совладельцев агентств, которые давно на рынке</li>
        </ul>
        <a href="#form" className="btn btn-outline">Узнать стоимость</a>
      </div>
    </div>

    <p className="pricing-footnote">Точную стоимость и то, какой формат подойдёт именно тебе, обсудим на созвоне — без давления, просто чтобы не тратить твоё время на вариант, который не подходит.</p>
  </section>

  
  <section id="process">
    <div className="sec-num">08</div>
    <h2 className="process-title">Что будет после заявки</h2>

    <div className="sequence">
      <div className="stage"><div className="rail"></div><div className="stage-num">1</div><div className="stage-body"><p>Оставляешь заявку.</p></div></div>
      <div className="stage"><div className="rail"></div><div className="stage-num">2</div><div className="stage-body"><p>Мы связываемся с тобой в течение дня.</p></div></div>
      <div className="stage"><div className="rail"></div><div className="stage-num">3</div><div className="stage-body"><p>Короткий созвон — разбираемся, какой формат подходит именно тебе.</p></div></div>
      <div className="stage"><div className="stage-num">4</div><div className="stage-body"><p>Если подходим друг другу — старт обучения и доступ к материалам, сети и Charme.</p></div></div>
    </div>
  </section>

  
  <section id="faq">
    <div className="sec-num">09</div>
    <h2 className="faq-title">Вопросы</h2>

    <div className="faq-list">
      <div className="faq-item">
        <button className="faq-question" aria-expanded="false" aria-controls="faq-a-1" id="faq-q-1">
          <span className="faq-index">01</span><span className="q">Нужен ли опыт для старта?</span><span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id="faq-a-1" role="region" aria-labelledby="faq-q-1">
          <div className="faq-answer-inner">Нет. Материалы и сеть подрядчиков рассчитаны на то, что ты начинаешь без готовых знаний о трафике и запуске.</div>
        </div>
      </div>
      <div className="faq-item">
        <button className="faq-question" aria-expanded="false" aria-controls="faq-a-2" id="faq-q-2">
          <span className="faq-index">02</span><span className="q">Сколько можно заработать?</span><span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id="faq-a-2" role="region" aria-labelledby="faq-q-2">
          <div className="faq-answer-inner">Мы не называем цифру заранее — слишком много переменных зависит от вовлечённости и модели. На созвоне разберём экономику конкретно под твою ситуацию. Мы не гарантируем доход: результат зависит от твоих действий, вложений и ситуации на рынке.</div>
        </div>
      </div>
      <div className="faq-item">
        <button className="faq-question" aria-expanded="false" aria-controls="faq-a-3" id="faq-q-3">
          <span className="faq-index">03</span><span className="q">Чем это отличается от других наставничеств?</span><span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id="faq-a-3" role="region" aria-labelledby="faq-q-3">
          <div className="faq-answer-inner">Кроме знаний, ты получаешь инструмент (Charme) и готовую сеть подрядчиков — то, что можно использовать сразу, а не только прочитать.</div>
        </div>
      </div>
      <div className="faq-item">
        <button className="faq-question" aria-expanded="false" aria-controls="faq-a-4" id="faq-q-4">
          <span className="faq-index">04</span><span className="q">Что если мне не подойдёт формат, который я выбрал?</span><span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id="faq-a-4" role="region" aria-labelledby="faq-q-4">
          <div className="faq-answer-inner">Подбор формата происходит на созвоне до оплаты — именно чтобы не ошибиться с выбором.</div>
        </div>
      </div>
      <div className="faq-item">
        <button className="faq-question" aria-expanded="false" aria-controls="faq-a-5" id="faq-q-5">
          <span className="faq-index">05</span><span className="q">А если я начну и пойму, что это не моё?</span><span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id="faq-a-5" role="region" aria-labelledby="faq-q-5">
          <div className="faq-answer-inner">Вернём деньги, если в течение недели поймёшь, что это тяжело и тебе не подходит.</div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="no-border" id="final">
    <div className="final-card">
      <div className="sec-num">10</div>
      <h2>Мы работаем. Сейчас — можно зайти вместе с нами.</h2>
      <p>Система собрана полностью впервые: инструмент, сеть, знания. Мы ведём ограниченное число участников одновременно — время команды не масштабируется. Когда места в потоке заканчиваются, набор закрывается до следующего.</p>
      <a href="#form" className="btn">Оставить заявку</a>
    </div>
  </section>

  
  <section className="no-border" id="form">
    <div id="form-card">
      <h2 className="form-title">Оставить заявку</h2>
      <form id="applyForm" noValidate>
        <div className="form-field"><label htmlFor="f-name">Имя</label><input type="text" id="f-name" name="name" required autoComplete="name" /></div>
        <div className="form-field"><label htmlFor="f-contact">Telegram или телефон</label><input type="text" id="f-contact" name="contact" required autoComplete="tel" /></div>
        <div className="form-field"><label htmlFor="f-comment">Комментарий (необязательно)</label><textarea id="f-comment" name="comment" rows={3}></textarea></div>
        <button type="submit" className="btn" disabled={sending}>{sending?"Отправляем…":"Отправить заявку"}</button>
        <p className="form-consent" style={{marginTop:"12px",fontSize:"13px",opacity:.7}}>Отправляя заявку, вы соглашаетесь с <a href="#privacy" onClick={()=>setPrivacyOpen(true)}>Политикой конфиденциальности</a> и подтверждаете, что вам есть 18 лет.</p>
        {formError&&<p className="form-error" role="alert" style={{marginTop:"12px",color:"#e2574c"}}>{formError}</p>}
      </form>
      <div className="form-success" id="formSuccess" role="status">Заявка получена. Мы свяжемся с тобой в течение дня.</div>
    </div>
  </section>

  <footer>
    <span>DeepOF Mentoring</span>
    <span>Email: paveldronov87@gmail.com · Telegram: <a href="https://t.me/deep0F" target="_blank" rel="noopener" className="footer-link">@deep0F</a></span>
    <a href="#privacy" onClick={()=>setPrivacyOpen(true)} className="footer-link">Политика конфиденциальности</a>
    <span className="footer-disclaimer">Информация на сайте носит образовательный характер. Мы не гарантируем доход — результаты зависят от действий участника. Только для лиц 18+.</span>
  </footer>
</div>
</main>

{privacyOpen&&<div className="privacy-overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onClick={(e)=>{if(e.target===e.currentTarget){setPrivacyOpen(false);history.replaceState(null,"",location.pathname+location.search)}}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"24px"}}>
  <div style={{background:"#fff",color:"#111",maxWidth:"560px",width:"100%",maxHeight:"80vh",overflowY:"auto",borderRadius:"12px",padding:"32px"}}>
    <h3 id="privacy-title" style={{marginTop:0}}>Политика конфиденциальности DeepOF Mentoring</h3>
    <p>Отправляя заявку на deepof.biz.ua, вы передаёте нам имя и контакт (телефон или Telegram). Мы используем их только чтобы связаться с вами по заявке и рассказать о программе. Мы не продаём ваши данные третьим лицам.</p>
    <p>Сайт использует файлы cookie и пиксель Meta (Facebook/Instagram), чтобы измерять эффективность рекламы и показывать рекламу посетителям сайта. Meta может получать технические данные о вашем визите и действиях на сайте. Отключить cookie можно в настройках браузера, а рекламу — в настройках рекламы вашего аккаунта Facebook/Instagram.</p>
    <p>Данные заявок хранятся не дольше 3 лет. Чтобы узнать, какие данные у нас есть, исправить или удалить их, напишите на paveldronov87@gmail.com. Сайт предназначен только для лиц старше 18 лет.</p>
    <button type="button" className="btn" onClick={()=>{setPrivacyOpen(false);history.replaceState(null,"",location.pathname+location.search)}}>Закрыть</button>
  </div>
</div>}

<div className={`sticky-bar ${sticky?"show":""}`}><span className="left">DeepOF — три формата участия, от $449</span><a href="#form" className="btn btn-small">Оставить заявку</a></div></>;}
