import type { PackingRoom } from "@/types";

interface RoomBlueprint {
  id: string;
  name: string;
  items: { name: string; completed: boolean }[];
}

const ROOM_BLUEPRINTS: RoomBlueprint[] = [
  {
    id: "room-bedroom",
    name: "غرفة النوم",
    items: [
      { name: "السرير والمرتبة", completed: true },
      { name: "خزانة الملابس", completed: true },
      { name: "المكتب والكرسي", completed: true },
      { name: "المصابيح والإضاءة", completed: true },
      { name: "اللوحات والمرايا", completed: true },
      { name: "الملاءات والمفروشات", completed: true },
      { name: "الستائر", completed: true },
      { name: "صناديق الأدراج", completed: true },
      { name: "الأجهزة الإلكترونية (تلفزيون وسماعات)", completed: true },
      { name: "السجاد", completed: true },
      { name: "الإكسسوارات الشخصية", completed: true },
      { name: "صندوق المجوهرات والأشياء الثمينة", completed: true },
      { name: "الكتب", completed: false },
      { name: "حقيبة الملابس الموسمية", completed: false },
    ],
  },
  {
    id: "room-kitchen",
    name: "المطبخ",
    items: [
      { name: "الأواني والمقالي", completed: true },
      { name: "الأطباق والصحون", completed: true },
      { name: "الأكواب والكاسات", completed: true },
      { name: "أدوات المائدة", completed: true },
      { name: "الأجهزة الصغيرة (خلاط ومحمصة)", completed: true },
      { name: "تفريغ الثلاجة وتنظيفها", completed: true },
      { name: "الفرن ولوازمه", completed: false },
      { name: "حاويات التخزين", completed: false },
      { name: "المواد الغذائية الجافة", completed: false },
      { name: "أكياس القمامة ولوازم التنظيف", completed: false },
      { name: "مفارش ومناشف المطبخ", completed: false },
      { name: "صندوق الأدوات الحادة (سكاكين)", completed: false },
    ],
  },
  {
    id: "room-living",
    name: "غرفة المعيشة",
    items: [
      { name: "الأريكة", completed: true },
      { name: "طاولة القهوة", completed: true },
      { name: "وحدة التلفزيون", completed: true },
      { name: "السجادة", completed: false },
      { name: "الستائر", completed: false },
      { name: "اللوحات والديكور", completed: false },
      { name: "مكتبة الكتب", completed: false },
      { name: "النباتات الداخلية", completed: false },
      { name: "الإضاءة والأباجورات", completed: false },
    ],
  },
  {
    id: "room-bathroom",
    name: "الحمام",
    items: [
      { name: "أدوات النظافة الشخصية", completed: true },
      { name: "المناشف", completed: true },
      { name: "ستارة الحمام", completed: true },
      { name: "سلة الغسيل", completed: true },
      { name: "خزانة الأدوية", completed: true },
      { name: "البساط", completed: true },
      { name: "مستلزمات التنظيف", completed: true },
    ],
  },
  {
    id: "room-storage",
    name: "المستودع",
    items: [
      { name: "أدوات الصيانة", completed: true },
      { name: "الدراجات", completed: true },
      { name: "المعدات الرياضية", completed: false },
      { name: "صناديق التخزين الموسمية", completed: false },
      { name: "أدوات الحديقة", completed: false },
      { name: "مستلزمات المناسبات والزينة", completed: false },
      { name: "قطع الغيار والأدوات الكهربائية", completed: false },
    ],
  },
];

export function generateDefaultPackingRooms(): PackingRoom[] {
  return ROOM_BLUEPRINTS.map((room) => ({
    id: room.id,
    name: room.name,
    items: room.items.map((item, index) => ({
      id: `${room.id}-item-${index + 1}`,
      name: item.name,
      completed: item.completed,
    })),
  }));
}
