import type { Task, TaskCategory, TaskPriority } from "@/types";
import { addDays, generateId, todayISO } from "@/lib/utils";

interface TaskBlueprint {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  /** إزاحة بالأيام عن موعد الانتقال (سالب = قبل الانتقال، صفر = يوم الانتقال، موجب = بعده). */
  offsetDays: number;
}

const TASK_BLUEPRINTS: TaskBlueprint[] = [
  { title: "تحديد ميزانية الانتقال المبدئية", category: "التخطيط", priority: "عالية", offsetDays: -30 },
  { title: "حجز شركة نقل الأثاث", category: "التخطيط", priority: "عالية", offsetDays: -24 },
  { title: "إشعار المالك أو المؤجر بإخلاء المسكن الحالي", category: "التخطيط", priority: "متوسطة", offsetDays: -21 },
  { title: "شراء مستلزمات التغليف (كراتين وشريط لاصق)", category: "التغليف", priority: "متوسطة", offsetDays: -14 },
  { title: "نقل عداد الكهرباء والمياه", category: "الأوراق والاشتراكات", priority: "عالية", offsetDays: -10 },
  { title: "تغليف الأغراض غير الأساسية", category: "التغليف", priority: "متوسطة", offsetDays: -10 },
  { title: "تحديث العنوان الوطني", category: "الأوراق والاشتراكات", priority: "متوسطة", offsetDays: -7 },
  { title: "إلغاء أو نقل اشتراك الإنترنت والاتصالات", category: "الأوراق والاشتراكات", priority: "متوسطة", offsetDays: -6 },
  { title: "تغليف المطبخ والأدوات الهشة", category: "التغليف", priority: "عالية", offsetDays: -4 },
  { title: "تأكيد موعد شركة التنظيف للمسكن القديم", category: "الخدمات", priority: "متوسطة", offsetDays: -3 },
  { title: "تأكيد موعد فريق نقل الأثاث", category: "الخدمات", priority: "عالية", offsetDays: -2 },
  { title: "تجهيز حقيبة الأساسيات ليوم الانتقال", category: "التغليف", priority: "عالية", offsetDays: -2 },
  { title: "تنظيف المسكن الجديد قبل الفرش", category: "المسكن الجديد", priority: "متوسطة", offsetDays: -1 },
  { title: "تسليم مفاتيح المسكن القديم", category: "يوم الانتقال", priority: "عالية", offsetDays: 0 },
  { title: "الإشراف على تحميل وتفريغ الأثاث", category: "يوم الانتقال", priority: "عالية", offsetDays: 0 },
  { title: "فحص المسكن الجديد وتوثيق أي ملاحظات", category: "المسكن الجديد", priority: "متوسطة", offsetDays: 1 },
  { title: "تركيب الستائر والإضاءة في المسكن الجديد", category: "المسكن الجديد", priority: "منخفضة", offsetDays: 3 },
  { title: "تحديث العنوان لدى خدمة التوصيل المفضلة", category: "المسكن الجديد", priority: "منخفضة", offsetDays: 6 },
];

/**
 * يبني قائمة مهام واقعية مرتبطة بتاريخ الانتقال الفعلي الذي اختاره المستخدم.
 * المهام التي يكون تاريخ استحقاقها في الماضي (بالنسبة لليوم) تُعتبر منجزة تلقائيًا
 * كنقطة بداية معقولة، ويبقى بإمكان المستخدم تعديل أي حالة يدويًا بعد ذلك.
 */
export function generateDefaultTasks(movingDateISO: string): Task[] {
  const today = todayISO();
  return TASK_BLUEPRINTS.map((blueprint) => {
    const dueDate = addDays(movingDateISO, blueprint.offsetDays);
    return {
      id: generateId("task"),
      title: blueprint.title,
      category: blueprint.category,
      priority: blueprint.priority,
      dueDate,
      completed: dueDate < today,
    };
  });
}
