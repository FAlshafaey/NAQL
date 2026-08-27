"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Building,
  Building2,
  DoorOpen,
  Home as HomeIcon,
  Sparkles as SparklesIcon,
  SprayCan,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { OptionCard } from "@/components/ui/OptionCard";
import { useJourney } from "@/context/JourneyContext";
import { todayISO } from "@/lib/utils";
import { CITIES, HOME_TYPES, type CityName, type HomeType } from "@/types";

const STEP_TITLES = ["التواريخ والمدن", "تفاصيل المسكن", "الخدمات المطلوبة"];

const HOME_TYPE_ICONS: Record<HomeType, typeof HomeIcon> = {
  شقة: Building2,
  فيلا: HomeIcon,
  "دور في فيلا": Building,
  استوديو: DoorOpen,
};

interface FormState {
  movingDate: string;
  currentCity: CityName | "";
  destinationCity: CityName | "";
  currentHomeType: HomeType | "";
  newHomeType: HomeType | "";
  roomsCount: number;
  peopleCount: number;
  needsFurnitureMoving: boolean;
  needsPacking: boolean;
  needsCleaning: boolean;
}

const INITIAL_FORM: FormState = {
  movingDate: "",
  currentCity: "",
  destinationCity: "",
  currentHomeType: "",
  newHomeType: "",
  roomsCount: 3,
  peopleCount: 2,
  needsFurnitureMoving: true,
  needsPacking: true,
  needsCleaning: true,
};

export default function StartPage() {
  const router = useRouter();
  const { startJourney } = useJourney();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const minDate = useMemo(() => todayISO(), []);

  const step1Valid = form.movingDate !== "" && form.movingDate >= minDate && form.currentCity !== "" && form.destinationCity !== "";
  const step2Valid = form.currentHomeType !== "" && form.newHomeType !== "";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    setAttemptedNext(true);
    if (step === 0 && !step1Valid) return;
    if (step === 1 && !step2Valid) return;

    if (step < STEP_TITLES.length - 1) {
      setAttemptedNext(false);
      setStep((s) => s + 1);
      return;
    }

    if (!form.currentCity || !form.destinationCity || !form.currentHomeType || !form.newHomeType) return;

    startJourney({
      movingDate: form.movingDate,
      currentCity: form.currentCity,
      destinationCity: form.destinationCity,
      currentHomeType: form.currentHomeType,
      newHomeType: form.newHomeType,
      roomsCount: form.roomsCount,
      peopleCount: form.peopleCount,
      needsFurnitureMoving: form.needsFurnitureMoving,
      needsPacking: form.needsPacking,
      needsCleaning: form.needsCleaning,
    });
    router.push("/dashboard");
  }

  function goBack() {
    setAttemptedNext(false);
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep((s) => s - 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <span className="text-sm text-ink-muted">
            الخطوة {step + 1} من {STEP_TITLES.length}
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              {STEP_TITLES.map((title, index) => (
                <div key={title} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      index <= step ? "bg-primary" : "bg-surface-muted"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 font-display text-xl font-bold text-ink">{STEP_TITLES[step]}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            {step === 0 ? (
              <div className="flex flex-col gap-6">
                <FormField
                  label="موعد الانتقال"
                  htmlFor="movingDate"
                  required
                  error={attemptedNext && form.movingDate === "" ? "الرجاء تحديد موعد الانتقال." : undefined}
                >
                  <Input
                    id="movingDate"
                    type="date"
                    min={minDate}
                    value={form.movingDate}
                    onChange={(e) => update("movingDate", e.target.value)}
                    hasError={attemptedNext && form.movingDate === ""}
                  />
                </FormField>

                <div>
                  <p className="mb-2 text-sm font-medium text-ink">
                    المدينة الحالية <span className="text-danger">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {CITIES.map((city) => (
                      <OptionCard
                        key={city}
                        selected={form.currentCity === city}
                        onClick={() => update("currentCity", city)}
                        title={city}
                        className="items-center text-center"
                      />
                    ))}
                  </div>
                  {attemptedNext && !form.currentCity ? (
                    <p className="mt-1.5 text-xs font-medium text-danger">الرجاء اختيار المدينة الحالية.</p>
                  ) : null}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-ink">
                    مدينة الوجهة <span className="text-danger">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {CITIES.map((city) => (
                      <OptionCard
                        key={city}
                        selected={form.destinationCity === city}
                        onClick={() => update("destinationCity", city)}
                        title={city}
                        className="items-center text-center"
                      />
                    ))}
                  </div>
                  {attemptedNext && !form.destinationCity ? (
                    <p className="mt-1.5 text-xs font-medium text-danger">الرجاء اختيار مدينة الوجهة.</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-2 text-sm font-medium text-ink">
                    نوع المسكن الحالي <span className="text-danger">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {HOME_TYPES.map((type) => {
                      const Icon = HOME_TYPE_ICONS[type];
                      return (
                        <OptionCard
                          key={type}
                          selected={form.currentHomeType === type}
                          onClick={() => update("currentHomeType", type)}
                          title={type}
                          icon={<Icon className="size-4 text-primary" strokeWidth={1.75} />}
                        />
                      );
                    })}
                  </div>
                  {attemptedNext && !form.currentHomeType ? (
                    <p className="mt-1.5 text-xs font-medium text-danger">الرجاء اختيار نوع المسكن الحالي.</p>
                  ) : null}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-ink">
                    نوع المسكن الجديد <span className="text-danger">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {HOME_TYPES.map((type) => {
                      const Icon = HOME_TYPE_ICONS[type];
                      return (
                        <OptionCard
                          key={type}
                          selected={form.newHomeType === type}
                          onClick={() => update("newHomeType", type)}
                          title={type}
                          icon={<Icon className="size-4 text-primary" strokeWidth={1.75} />}
                        />
                      );
                    })}
                  </div>
                  {attemptedNext && !form.newHomeType ? (
                    <p className="mt-1.5 text-xs font-medium text-danger">الرجاء اختيار نوع المسكن الجديد.</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3">
                  <NumberStepper
                    id="roomsCount"
                    label="عدد الغرف"
                    value={form.roomsCount}
                    onChange={(v) => update("roomsCount", v)}
                    min={1}
                    max={10}
                  />
                  <NumberStepper
                    id="peopleCount"
                    label="عدد أفراد الأسرة"
                    value={form.peopleCount}
                    onChange={(v) => update("peopleCount", v)}
                    min={1}
                    max={15}
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="flex flex-col gap-3">
                <p className="mb-1 text-sm text-ink-muted">حدد الخدمات التي تحتاجها. يمكنك تعديل هذا لاحقًا من صفحة الخدمات.</p>
                <ServiceToggle
                  icon={Truck}
                  title="نقل الأثاث"
                  description="هل تحتاج مساعدة في نقل الأثاث؟"
                  checked={form.needsFurnitureMoving}
                  onChange={(v) => update("needsFurnitureMoving", v)}
                />
                <ServiceToggle
                  icon={SparklesIcon}
                  title="التغليف"
                  description="هل تحتاج مساعدة في تغليف الأغراض؟"
                  checked={form.needsPacking}
                  onChange={(v) => update("needsPacking", v)}
                />
                <ServiceToggle
                  icon={SprayCan}
                  title="التنظيف"
                  description="هل تحتاج خدمة تنظيف للمسكن القديم أو الجديد؟"
                  checked={form.needsCleaning}
                  onChange={(v) => update("needsCleaning", v)}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={goBack}>
              {step === 0 ? "رجوع للرئيسية" : "رجوع"}
            </Button>
            <Button onClick={goNext}>
              {step === STEP_TITLES.length - 1 ? "ابدأ رحلة انتقالك" : "التالي"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ServiceToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Truck;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? "border-primary bg-primary-light/60" : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span>
          <span className="block text-sm font-medium text-ink">{title}</span>
          <span className="block text-xs text-ink-muted">{description}</span>
        </span>
      </span>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-primary justify-start" : "bg-border-strong justify-end"
        }`}
      >
        <span className="size-5 rounded-full bg-white shadow-sm transition-transform" />
      </span>
    </button>
  );
}
