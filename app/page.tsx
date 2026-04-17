"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Bell,
  User,
  BookOpen,
  Filter,
  ChevronDown,
  ArrowLeft,
  AlertTriangle,
  PlusCircle,
  Database,
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox?: boolean }) => void
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: unknown) => void
      ) => Promise<{
        accessToken: string
        user?: {
          uid?: string
          username?: string
        }
      }>
    }
  }
}

type PiUserType = {
  uid?: string
  username?: string
}

type CourseType = {
  id: number
  title: string
  instructor: string
  priceLabel: string
  originalPrice?: string
  amount: number | null
  rating: number
  students: number
  duration: string
  image: string
  isFree: boolean
  isNew: boolean
  cta: string
  memo: string
}

type MyCourseType = {
  id: number
  title: string
  progress: number
  nextLesson: string
  image: string
}

export default function TrainingCoursesApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [piReady, setPiReady] = useState(false)
  const [piUser, setPiUser] = useState<PiUserType | null>(null)
  const [status, setStatus] = useState("جاهز")
  const [busy, setBusy] = useState<"login" | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0" })
        setPiReady(true)
        clearInterval(timer)
      }
    }, 300)

    return () => clearInterval(timer)
  }, [])

  async function handlePiLogin() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK غير جاهز")
        return
      }

      setBusy("login")
      setStatus("جاري تسجيل الدخول...")

      const auth = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          console.log("Incomplete payment found:", payment)
        }
      )

      setPiUser(auth.user || null)
      setStatus("تم تسجيل الدخول بنجاح")
    } catch (error) {
      console.error(error)
      setStatus("فشل تسجيل الدخول")
    } finally {
      setBusy(null)
    }
  }

  const categories: { name: string; icon: string; courses: number }[] = []

  const featuredCourses: CourseType[] = []

  const myCourses: MyCourseType[] = []

  function SectionHeader({
    title,
    action = "عرض الكل",
  }: {
    title: string
    action?: string
  }) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <button className="text-xl font-medium text-slate-900">{action}</button>
        <h2 className="text-3xl font-extrabold text-slate-950">{title}</h2>
      </div>
    )
  }

  function TopBar() {
    return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronDown className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold">دورات تدريبية</h1>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              🎓
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>
    )
  }

  function SearchBox({ placeholder }: { placeholder: string }) {
    return (
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
        <Input
          dir="rtl"
          placeholder={placeholder}
          className="h-16 rounded-2xl border-slate-200 bg-white pr-4 pl-12 text-right text-2xl"
        />
      </div>
    )
  }

  function EmptyState({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode
    title: string
    description: string
  }) {
    return (
      <Card className="rounded-3xl border border-dashed border-slate-300 shadow-none">
        <CardContent className="p-8 text-center">
          <div className="mb-4 flex justify-center text-slate-400">{icon}</div>
          <h3 className="mb-2 text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-lg leading-8 text-slate-500">{description}</p>
        </CardContent>
      </Card>
    )
  }

  function PiPanel() {
    return (
      <Card className="rounded-3xl border border-dashed border-slate-300">
        <CardContent className="p-5 text-right">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
              {piReady ? "SDK جاهز" : "SDK غير جاهز"}
            </Badge>
            <h3 className="text-xl font-bold">لوحة Pi</h3>
          </div>

          <div className="space-y-2 text-base text-slate-700">
            <p>الحالة: {status}</p>
            <p>المستخدم: {piUser?.username || "غير مسجل"}</p>
          </div>

          <div className="mt-5">
            <Button
              onClick={handlePiLogin}
              disabled={busy !== null}
              className="h-12 w-full rounded-2xl"
            >
              {busy === "login" ? "جاري الدخول..." : "تسجيل الدخول بـ Pi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const HomeContent = () => (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-right">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-950">
            مرحباً بك
          </h1>
          <p className="mt-2 text-2xl text-slate-500">ابدأ بناء منصة الدورات الخاصة بك</p>
        </div>
      </div>

      <SearchBox placeholder="ابحث عن الدورات..." />

      <div>
        <SectionHeader title="التصنيفات" action="" />
        {categories.length === 0 ? (
          <EmptyState
            icon={<LayoutGrid className="h-10 w-10" />}
            title="لا توجد تصنيفات بعد"
            description="ستظهر التصنيفات هنا عندما تبدأ المنصة باستقبال الدورات الحقيقية من المستخدمين."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="rounded-3xl border border-slate-200 shadow-sm">
                <CardContent className="flex min-h-[170px] flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 text-5xl">{category.icon}</div>
                  <h3 className="mb-2 text-2xl font-extrabold text-slate-950">
                    {category.name}
                  </h3>
                  <p className="text-xl text-slate-500">{category.courses} دورة</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="دوراتي" />
        {myCourses.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title="لا توجد دورات في حسابك"
            description="عندما يشترك المستخدم في دورة أو ينشئ دورة جديدة ستظهر هنا."
          />
        ) : null}
      </div>

      <div>
        <SectionHeader title="الدورات المميزة" />
        {featuredCourses.length === 0 ? (
          <EmptyState
            icon={<Database className="h-10 w-10" />}
            title="لا توجد دورات منشورة بعد"
            description="هذا التطبيق جاهز الآن ليتم ربطه بقاعدة بيانات ونظام يسمح للمستخدمين الحقيقيين بإضافة دوراتهم."
          />
        ) : null}
      </div>

      <PiPanel />
    </div>
  )

  const ExploreContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl">
          <Filter className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl font-extrabold text-slate-950">استكشف الدورات</h1>
      </div>

      <SearchBox placeholder="ابحث عن الدورات..." />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid h-14 w-full grid-cols-3 rounded-2xl bg-slate-100">
          <TabsTrigger value="paid" className="text-xl">
            مدفوعة
          </TabsTrigger>
          <TabsTrigger value="free" className="text-xl">
            مجانية
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xl">
            الكل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <EmptyState
            icon={<PlusCircle className="h-10 w-10" />}
            title="لا توجد نتائج بعد"
            description="هذه الصفحة جاهزة لعرض الدورات القادمة من قاعدة البيانات عندما تبدأ بإضافة المحتوى الحقيقي."
          />
        </TabsContent>

        <TabsContent value="free" className="mt-6">
          <EmptyState
            icon={<BookOpen className="h-10 w-10" />}
            title="لا توجد دورات مجانية بعد"
            description="عند إضافة أول دورة مجانية من لوحة التحكم ستظهر هنا تلقائيًا."
          />
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <EmptyState
            icon={<Database className="h-10 w-10" />}
            title="لا توجد دورات مدفوعة بعد"
            description="عند ربط التطبيق بالدفع وإضافة دورات مدفوعة من المستخدمين ستظهر هنا."
          />
        </TabsContent>
      </Tabs>

      <PiPanel />
    </div>
  )

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="pt-2 text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="text-2xl">
            {piUser?.username?.slice(0, 2) || "أح"}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-4xl font-extrabold text-slate-950">
          {piUser?.username || "أحمد محمد"}
        </h1>
        <p className="mt-2 text-2xl text-slate-500">منشئ منصة دورات</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-5xl font-extrabold text-slate-950">0</p>
          <p className="mt-2 text-xl text-slate-500">دورة مكتملة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-950">0</p>
          <p className="mt-2 text-xl text-slate-500">دورة منشورة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-950">0.0</p>
          <p className="mt-2 text-xl text-slate-500">تقييم المدرب</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { icon: "📚", title: "دوراتي" },
          { icon: "➕", title: "إنشاء دورة جديدة" },
          { icon: "💰", title: "الأرباح" },
          { icon: "⚙️", title: "الإعدادات" },
          { icon: "❓", title: "المساعدة" },
        ].map((item) => (
          <Card key={item.title} className="rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-3xl font-medium text-slate-950">{item.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <PiPanel />
    </div>
  )

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <TopBar />

      <main className="px-4 pb-28 pt-6">
        {activeTab === "home" && <HomeContent />}
        {activeTab === "explore" && <ExploreContent />}
        {activeTab === "profile" && <ProfileContent />}
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background">
        <div className="grid grid-cols-3 gap-2 px-3 py-3">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="h-16 flex-col rounded-3xl text-lg"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mb-1 h-5 w-5" />
            الملف الشخصي
          </Button>

          <Button
            variant={activeTab === "explore" ? "default" : "ghost"}
            className="h-16 flex-col rounded-3xl text-lg"
            onClick={() => setActiveTab("explore")}
          >
            <Search className="mb-1 h-5 w-5" />
            استكشف
          </Button>

          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className="h-16 flex-col rounded-3xl text-lg"
            onClick={() => setActiveTab("home")}
          >
            <BookOpen className="mb-1 h-5 w-5" />
            الرئيسية
          </Button>
        </div>
      </nav>
    </div>
  )
                     }
