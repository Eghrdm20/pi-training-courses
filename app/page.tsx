"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Bell,
  User,
  BookOpen,
  Star,
  Clock,
  Users,
  Heart,
  Filter,
  ChevronDown,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

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
      createPayment: (
        paymentData: {
          amount: number
          memo: string
          metadata: Record<string, unknown>
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void | Promise<void>
          onReadyForServerCompletion: (paymentId: string, txid: string) => void | Promise<void>
          onCancel: (paymentId: string) => void
          onError: (error: unknown, payment?: unknown) => void
        }
      ) => Promise<unknown>
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
  price: string
  originalPrice?: string
  rating: number
  students: number
  duration: string
  image: string
  isFree: boolean
  isNew: boolean
  cta: string
}

export default function TrainingCoursesApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [piReady, setPiReady] = useState(false)
  const [piUser, setPiUser] = useState<PiUserType | null>(null)
  const [status, setStatus] = useState("جاهز")
  const [busy, setBusy] = useState<"login" | "pay" | null>(null)

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

  async function handlePiPayment() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK غير جاهز")
        return
      }

      if (!piUser) {
        setStatus("سجل الدخول أولًا")
        return
      }

      setBusy("pay")
      setStatus("جاري بدء الدفع...")

      await window.Pi.createPayment(
        {
          amount: 1,
          memo: "اشتراك دورة مدفوع بعملة Pi",
          metadata: {
            productId: "course-pi-001",
            productName: "اشتراك دورة تدريبية",
            userUid: piUser.uid || "unknown",
          },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("تم إنشاء الدفع، جاري موافقة السيرفر...")

            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ paymentId }),
            })

            if (!res.ok) {
              const text = await res.text()
              throw new Error(`Approve failed: ${text}`)
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("تمت المعاملة، جاري الإكمال...")

            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ paymentId, txid }),
            })

            if (!res.ok) {
              const text = await res.text()
              throw new Error(`Complete failed: ${text}`)
            }

            setStatus("تم الدفع بنجاح بعملة Pi")
          },

          onCancel: () => {
            setStatus("تم إلغاء الدفع")
          },

          onError: (error: unknown) => {
            console.error(error)
            setStatus("حدث خطأ أثناء الدفع")
          },
        }
      )
    } catch (error) {
      console.error(error)
      setStatus("فشل تنفيذ الدفع")
    } finally {
      setBusy(null)
    }
  }

  const categories = [
    { name: "البرمجة", icon: "💻", courses: 45 },
    { name: "التصميم", icon: "🎨", courses: 32 },
    { name: "التسويق", icon: "📈", courses: 28 },
    { name: "الأعمال", icon: "💼", courses: 38 },
    { name: "اللغات", icon: "🗣️", courses: 25 },
    { name: "الطبخ", icon: "👨‍🍳", courses: 18 },
  ]

  const featuredCourses: CourseType[] = [
    {
      id: 1,
      title: "تطوير تطبيقات الجوال بـ React Native",
      instructor: "أحمد محمد",
      price: "1 Pi",
      originalPrice: "1.5 Pi",
      rating: 4.8,
      students: 1250,
      duration: "12 ساعة",
      image: "/placeholder.svg",
      isFree: false,
      isNew: true,
      cta: "اشترك الآن",
    },
    {
      id: 2,
      title: "أساسيات التصميم الجرافيكي",
      instructor: "فاطمة علي",
      price: "مجاني",
      rating: 4.6,
      students: 2100,
      duration: "8 ساعات",
      image: "/placeholder.svg",
      isFree: true,
      isNew: false,
      cta: "ابدأ الآن",
    },
    {
      id: 3,
      title: "التسويق الرقمي للمبتدئين",
      instructor: "محمد السعيد",
      price: "0.7 Pi",
      originalPrice: "1 Pi",
      rating: 4.7,
      students: 890,
      duration: "10 ساعات",
      image: "/placeholder.svg",
      isFree: false,
      isNew: false,
      cta: "اشترك الآن",
    },
  ]

  const myCourses = [
    {
      id: 1,
      title: "تصميم واجهات المستخدم",
      progress: 45,
      nextLesson: "الدرس 5: نظرية الألوان",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "JavaScript المتقدم",
      progress: 75,
      nextLesson: "الدرس 8: Async/Await",
      image: "/placeholder.svg",
    },
  ]

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

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              onClick={handlePiLogin}
              disabled={busy !== null}
              className="h-12 rounded-2xl"
            >
              {busy === "login" ? "جاري الدخول..." : "تسجيل الدخول بـ Pi"}
            </Button>

            <Button
              variant="outline"
              onClick={handlePiPayment}
              disabled={busy !== null}
              className="h-12 rounded-2xl"
            >
              {busy === "pay" ? "جاري الدفع..." : "ادفع 1 Pi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  function CategoryCard({
    icon,
    name,
    courses,
  }: {
    icon: string
    name: string
    courses: number
  }) {
    return (
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[170px] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 text-5xl">{icon}</div>
          <h3 className="mb-2 text-2xl font-extrabold text-slate-950">{name}</h3>
          <p className="text-xl text-slate-500">{courses} دورة</p>
        </CardContent>
      </Card>
    )
  }

  function MyCourseCard({
    title,
    nextLesson,
    progress,
    image,
  }: {
    title: string
    nextLesson: string
    progress: number
    image: string
  }) {
    return (
      <Card className="min-w-[330px] rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={image}
                alt={title}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <h3 className="mb-2 text-2xl font-extrabold leading-snug text-slate-950">
                {title}
              </h3>
              <p className="mb-4 text-lg text-slate-500">{nextLesson}</p>

              <div className="h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-slate-900 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xl text-slate-500">{progress}% مكتمل</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function FeaturedCourseCard({ course }: { course: CourseType }) {
    return (
      <Card className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="relative h-60 w-full bg-slate-100">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />

            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-4 h-14 w-14 rounded-3xl bg-white/90"
            >
              <Heart className="h-6 w-6" />
            </Button>

            {course.isNew && (
              <Badge className="absolute right-4 top-4 rounded-full bg-green-500 px-4 py-1 text-lg text-white">
                جديد
              </Badge>
            )}
          </div>

          <div className="space-y-4 p-5 text-right">
            <div>
              <h3 className="mb-2 text-3xl font-extrabold leading-snug text-slate-950">
                {course.title}
              </h3>
              <p className="text-2xl text-slate-500">بواسطة {course.instructor}</p>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <div className="flex items-center gap-1 text-2xl font-bold text-slate-900">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>

              <div className="flex items-center gap-4 text-lg">
                <span className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  {course.students}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  {course.duration}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="text-right">
                <div className="text-4xl font-extrabold text-slate-950">
                  {course.price}
                </div>
                {course.originalPrice && (
                  <div className="text-2xl text-slate-400 line-through">
                    {course.originalPrice}
                  </div>
                )}
              </div>

              <Button className="h-14 rounded-2xl px-6 text-xl font-bold">
                {course.cta}
              </Button>
            </div>
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
          <p className="mt-2 text-2xl text-slate-500">ابدأ رحلة التعلم اليوم</p>
        </div>
      </div>

      <SearchBox placeholder="ابحث عن الدورات..." />

      <div>
        <SectionHeader title="التصنيفات" action="" />
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              courses={category.courses}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="دوراتي" />
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4" dir="rtl">
            {myCourses.map((course) => (
              <MyCourseCard
                key={course.id}
                title={course.title}
                nextLesson={course.nextLesson}
                progress={course.progress}
                image={course.image}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <SectionHeader title="الدورات المميزة" />
        <div className="space-y-5">
          {featuredCourses.map((course) => (
            <FeaturedCourseCard key={course.id} course={course} />
          ))}
        </div>
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

        <TabsContent value="all" className="mt-6 space-y-4">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="rounded-3xl border border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="mb-2 text-2xl font-extrabold leading-snug text-slate-950">
                      {course.title}
                    </h3>
                    <p className="mb-3 text-xl text-slate-500">بواسطة {course.instructor}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-extrabold text-slate-950">
                        {course.price}
                      </span>

                      <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="free" className="mt-6 space-y-4">
          {featuredCourses
            .filter((course) => course.isFree)
            .map((course) => (
              <Card key={course.id} className="rounded-3xl border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                      <Image src={course.image} alt={course.title} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <h3 className="mb-2 text-2xl font-extrabold leading-snug text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mb-3 text-xl text-slate-500">بواسطة {course.instructor}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-extrabold text-slate-950">
                          {course.price}
                        </span>

                        <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="paid" className="mt-6 space-y-4">
          {featuredCourses
            .filter((course) => !course.isFree)
            .map((course) => (
              <Card key={course.id} className="rounded-3xl border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                      <Image src={course.image} alt={course.title} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <h3 className="mb-2 text-2xl font-extrabold leading-snug text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mb-3 text-xl text-slate-500">بواسطة {course.instructor}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-extrabold text-slate-950">
                          {course.price}
                        </span>

                        <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
        <p className="mt-2 text-2xl text-slate-500">مطور تطبيقات</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-5xl font-extrabold text-slate-950">12</p>
          <p className="mt-2 text-xl text-slate-500">دورة مكتملة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-950">3</p>
          <p className="mt-2 text-xl text-slate-500">دورة منشورة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-950">4.8</p>
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
