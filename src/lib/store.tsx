"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CITIES,
  accentDimFor,
  accentFor,
  type City,
  type CityKey,
} from "@/data/cities";
import {
  CALENDAR_MONTHS,
  GUEST_OPTIONS,
  MONTHS,
  type GuestValue,
} from "@/data/site";

const CITY_STORAGE_KEY = "karvon_city";
const AUTOPLAY_MS = 8000;

export type Popover = "month" | "guests" | null;

/** A booking request in flight. `pkg` is the prefilled package label. */
type Booking = { pkg: string | null };

export type CalendarDay = {
  /** Day of month, or null for the leading blanks before the 1st. */
  day: number | null;
  /** True for days before today — rendered dim and non-interactive. */
  past: boolean;
  selected: boolean;
};

type Store = {
  city: City;
  cityIndex: number;
  cities: readonly City[];
  accent: string;
  accentDim: string;
  selectCity: (index: number) => void;

  /** Date picker */
  dateLabel: string;
  calendarLabel: string;
  calendarDays: CalendarDay[];
  canGoBack: boolean;
  canGoForward: boolean;
  prevMonth: () => void;
  nextMonth: () => void;
  pickDay: (day: number) => void;

  /** Guests */
  guests: GuestValue;
  guestsLabel: string;
  setGuests: (value: GuestValue) => void;

  /** Popovers */
  popover: Popover;
  togglePopover: (which: Exclude<Popover, null>) => void;
  closePopover: () => void;

  /** Mobile menu */
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;

  /** Booking modal */
  bookingOpen: boolean;
  bookingSent: boolean;
  bookingTitle: string;
  openBooking: (pkg?: string | null) => void;
  closeBooking: () => void;
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  error: string;
  submitBooking: () => void;

  scrollTo: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function useKarvon(): Store {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useKarvon must be used inside <KarvonProvider>");
  }
  return store;
}

/**
 * localStorage as an external store, so the persisted city is picked up right
 * after hydration without a cascading re-render, and a choice made in another
 * tab is noticed too.
 */
function readStoredCity(): number | null {
  try {
    const raw = window.localStorage.getItem(CITY_STORAGE_KEY);
    if (raw === null) return null;
    const index = Number(raw);
    return Number.isInteger(index) && index >= 0 && index < CITIES.length
      ? index
      : null;
  } catch {
    return null;
  }
}

function readStoredCityOnServer(): number | null {
  return null;
}

function subscribeToStoredCity(onChange: () => void): () => void {
  const handle = (event: StorageEvent) => {
    if (event.key === null || event.key === CITY_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handle);
  return () => window.removeEventListener("storage", handle);
}

/**
 * The current date, also as an external store. The server (or, for a static
 * export, the build) supplies the first value so hydration matches; the client
 * then reads the real date and re-reads it again when the day rolls over. This
 * is what keeps the picker honest on a page that was built days ago.
 */
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function readClientDate(): string {
  return formatDate(new Date());
}

function subscribeToDate(onChange: () => void): () => void {
  let timer = 0;
  const scheduleMidnight = () => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    timer = window.setTimeout(() => {
      onChange();
      scheduleMidnight();
    }, midnight.getTime() - now.getTime() + 1000);
  };
  scheduleMidnight();
  return () => window.clearTimeout(timer);
}

/** Is this selection still inside the picker's range, and not in the past? */
function isSelectable(
  selection: { year: number; month: number; day: number },
  baseMonth: { year: number; month: number },
  today: Date,
): boolean {
  const offset = monthsBetween(baseMonth, selection);
  if (offset < 0 || offset >= CALENDAR_MONTHS) return false;
  return new Date(selection.year, selection.month, selection.day) >= today;
}

/** Months between two {year, month} pairs. */
function monthsBetween(
  from: { year: number; month: number },
  to: { year: number; month: number },
): number {
  return (to.year - from.year) * 12 + (to.month - from.month);
}

function addMonths(
  base: { year: number; month: number },
  offset: number,
): { year: number; month: number } {
  const total = base.year * 12 + base.month + offset;
  return { year: Math.floor(total / 12), month: total % 12 };
}

export type KarvonProviderProps = {
  children: ReactNode;
  /**
   * Today's date as `YYYY-MM-DD`, computed on the server so the first client
   * render matches the markup. If the client's real date has moved on since
   * (a statically rendered page served the next day), it corrects itself on
   * mount.
   */
  today: string;
  /** Which city the page opens on. */
  startCity?: CityKey;
  /** Cycle through cities every 8s. Off by default, as in the prototype. */
  autoplay?: boolean;
};

export function KarvonProvider({
  children,
  today: todayProp,
  startCity = "rim",
  autoplay = false,
}: KarvonProviderProps) {
  // `todayProp` is only the first snapshot — the value the server, or a static
  // build, rendered with. The client swaps in the real date right after
  // hydration, so neither a cached page nor a week-old build shows stale days.
  const todayISO = useSyncExternalStore(
    subscribeToDate,
    readClientDate,
    () => todayProp,
  );

  const today = useMemo(() => {
    const [year, month, day] = todayISO.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [todayISO]);

  const startIndex = Math.max(
    0,
    CITIES.findIndex((c) => c.key === startCity),
  );

  // The city the visitor last looked at, read from localStorage. On the server
  // and during hydration this is null, so the markup uses `startCity`; React
  // re-reads it right after hydration and swaps the city in.
  const storedIndex = useSyncExternalStore(
    subscribeToStoredCity,
    readStoredCity,
    readStoredCityOnServer,
  );

  // An explicit choice in this tab outranks both, and keeps working when
  // localStorage is unavailable (private mode, blocked site data).
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const cityIndex = chosenIndex ?? storedIndex ?? startIndex;

  // The date picker spans CALENDAR_MONTHS starting from today's month.
  const baseMonth = useMemo(
    () => ({ year: today.getFullYear(), month: today.getMonth() }),
    [today],
  );

  // Default selection: the 14th of next month, matching the prototype.
  const defaultSelected = useMemo(() => {
    const next = addMonths(baseMonth, 1);
    return { year: next.year, month: next.month, day: 14 };
  }, [baseMonth]);

  // The visitor's pick, when they have made one. It is validated on read
  // rather than corrected in an effect, so a pick that the date rolling over
  // has pushed into the past simply falls back to the default.
  const [pickedDate, setPickedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  const selected =
    pickedDate && isSelectable(pickedDate, baseMonth, today)
      ? pickedDate
      : defaultSelected;

  // Which month the calendar is scrolled to; null means "the selected one".
  const [view, setView] = useState<number | null>(null);
  const [guests, setGuestsState] = useState<GuestValue>("2");
  const [popover, setPopover] = useState<Popover>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const selectCity = useCallback((index: number) => {
    setChosenIndex(index);
    try {
      window.localStorage.setItem(CITY_STORAGE_KEY, String(index));
    } catch {
      // Blocked storage — the choice still applies for this visit.
    }
  }, []);

  /* --- Autoplay --------------------------------------------------------- */
  const paused = booking !== null || popover !== null || menuOpen;
  useEffect(() => {
    if (!autoplay || paused) return;
    const timer = window.setInterval(() => {
      selectCity((cityIndex + 1) % CITIES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, cityIndex, selectCity]);

  /* --- Close popovers on an outside click ------------------------------- */
  useEffect(() => {
    if (!popover) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-search-form]")) return;
      setPopover(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [popover]);

  /* --- Escape closes whatever is on top -------------------------------- */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (booking) {
        setBooking(null);
        setSent(false);
        setError("");
      } else if (popover) {
        setPopover(null);
      } else if (menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [booking, popover, menuOpen]);

  /* --- Lock the page behind the modal and the mobile menu --------------- */
  useEffect(() => {
    if (!booking && !menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [booking, menuOpen]);

  const city = CITIES[cityIndex];
  const accent = accentFor(city.hue);
  const accentDim = accentDimFor(city.hue);

  /* --- Calendar --------------------------------------------------------- */
  const viewOffset =
    view ?? Math.max(0, Math.min(CALENDAR_MONTHS - 1, monthsBetween(baseMonth, selected)));
  const viewMonth = addMonths(baseMonth, viewOffset);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const { year, month } = viewMonth;
    // getDay() is Sunday-first; shift so Monday is column 0.
    const lead = (new Date(year, month, 1).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();

    const days: CalendarDay[] = [];
    for (let i = 0; i < lead; i += 1) {
      days.push({ day: null, past: true, selected: false });
    }
    for (let day = 1; day <= count; day += 1) {
      days.push({
        day,
        past: new Date(year, month, day) < today,
        selected:
          year === selected.year &&
          month === selected.month &&
          day === selected.day,
      });
    }
    return days;
  }, [viewMonth, today, selected]);

  const pickDay = useCallback(
    (day: number) => {
      setPickedDate({ year: viewMonth.year, month: viewMonth.month, day });
      setPopover(null);
    },
    [viewMonth],
  );

  const togglePopover = useCallback((which: Exclude<Popover, null>) => {
    setPopover((current) => (current === which ? null : which));
    // Reopening the calendar always lands on the selected month.
    if (which === "month") setView(null);
  }, []);

  const openBooking = useCallback((pkg: string | null = null) => {
    setBooking({ pkg });
    setSent(false);
    setError("");
    setPopover(null);
    setMenuOpen(false);
  }, []);

  const closeBooking = useCallback(() => {
    setBooking(null);
    setSent(false);
    setError("");
  }, []);

  const submitBooking = useCallback(() => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError("Telefon raqamini to'liq kiriting");
      return;
    }
    // TODO(launch): POST { name, phone, city, date, guests, package } to the
    // booking endpoint (a Telegram bot or a form service) before showing the
    // success state. The prototype only simulates it.
    setSent(true);
  }, [phone]);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      city,
      cityIndex,
      cities: CITIES,
      accent,
      accentDim,
      selectCity,

      dateLabel: `${selected.day} ${MONTHS[selected.month]} ${selected.year}`,
      calendarLabel: `${MONTHS[viewMonth.month]} ${viewMonth.year}`,
      calendarDays,
      canGoBack: viewOffset > 0,
      canGoForward: viewOffset < CALENDAR_MONTHS - 1,
      prevMonth: () => setView(Math.max(0, viewOffset - 1)),
      nextMonth: () =>
        setView(Math.min(CALENDAR_MONTHS - 1, viewOffset + 1)),
      pickDay,

      guests,
      guestsLabel:
        GUEST_OPTIONS.find((option) => option.value === guests)?.label ??
        GUEST_OPTIONS[1].label,
      setGuests: (next) => {
        setGuestsState(next);
        setPopover(null);
      },

      popover,
      togglePopover,
      closePopover: () => setPopover(null),

      menuOpen,
      toggleMenu: () => setMenuOpen((open) => !open),
      closeMenu: () => setMenuOpen(false),

      bookingOpen: booking !== null,
      bookingSent: sent,
      bookingTitle: booking?.pkg ?? `${city.name}ga sayohat`,
      openBooking,
      closeBooking,
      name,
      setName: (next) => {
        setName(next);
        setError("");
      },
      phone,
      setPhone: (next) => {
        setPhone(next);
        setError("");
      },
      error,
      submitBooking,

      scrollTo,
    }),
    [
      city,
      cityIndex,
      accent,
      accentDim,
      selectCity,
      selected,
      viewMonth,
      viewOffset,
      calendarDays,
      pickDay,
      guests,
      popover,
      togglePopover,
      menuOpen,
      booking,
      sent,
      name,
      phone,
      error,
      openBooking,
      closeBooking,
      submitBooking,
      scrollTo,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      <div
        className="accent-shift min-h-screen bg-ink text-cream"
        style={
          {
            "--color-accent": accent,
            "--color-accent-dim": accentDim,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </StoreContext.Provider>
  );
}
