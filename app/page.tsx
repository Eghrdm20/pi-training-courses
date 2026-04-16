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

  async function handleTestPayment() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK غير جاهز")
        return
      }

      if (!piUser) {
        setStatus("سجّل الدخول أولًا")
        return
      }

      setBusy("pay")
      setStatus("جاري بدء الدفع...")

      const paymentData = {
        amount: 0.01,
        memo: "اشتراك تجريبي لإكمال خطوة Pi",
        metadata: {
          productId: "course-test-001",
          userUid: piUser.uid || "unknown",
        },
      }

      await window.Pi.createPayment(paymentData, {
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

          setStatus("تم الدفع بنجاح")
        },

        onCancel: () => {
          setStatus("تم إلغاء الدفع")
        },

        onError: (error: unknown) => {
          console.error(error)
          setStatus("حدث خطأ أثناء الدفع")
        },
      })
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
      price: "299 درهم",
      originalPrice: "399 درهم",
      rating: 4.8,
      students: 1250,
      duration: "12 ساعة",
      image: "/placeholder.svg?height=240&width=420",
      isFree: false,
      isNew: true,
    },
    {
      id: 2,
      title: "أساسيات التصميم الجرافيكي",
      instructor: "فاطمة علي",
      price: "مجاني",
      rating: 4.6,
      students: 2100,
      duration: "8 ساعات",
      image: "/placeholder.svg?height=240&width=420",
      isFree: true,
      isNew: false,
    },
    {
      id: 3,
      title: "التسويق الرقمي للمبتدئين",
      instructor: "محمد السعيد",
      price: "199 درهم",
      rating: 4.7,
      students: 890,
      duration: "10 ساعات",
      image: "/placeholder.svg?height=240&width=420",
      isFree: false,
      isNew: false,
    },
  ]

  const myCourses = [
    {
      id: 1,
      title: "تصميم واجهات المستخدم",
      progress: 45,
      nextLesson: "الدرس 5: نظرية الألوان",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "JavaScript المتقدم",
      progress: 75,
      nextLesson: "الدرس 8: Async/Await",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  function AppHeader() {
    return (
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-sm">
              🎓
            </div>
            <span className="text-lg font-semibold">دورات تدريبية</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  function PiPanel() {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-right">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="secondary">{piReady ? "SDK جاهز" : "SDK غير جاهز"}</Badge>
            <h3 className="font-semibold">لوحة Pi</h3>
          </div>

          <div className="space-y-2 text-sm">
            <p>الحالة: {status}</p>
            <p>المستخدم: {piUser?.username || "غير مسجل"}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={handlePiLogin} disabled={busy !== null}>
              {busy === "login" ? "جاري الدخول..." : "تسجيل الدخول بـ Pi"}
            </Button>

            <Button variant="outline" onClick={handleTestPayment} disabled={busy !== null}>
              {busy === "pay" ? "جاري الدفع..." : "دفع تجريبي 0.01 Pi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const HomeContent = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-right">
          <h1 className="text-4xl font-extrabold tracking-tight">مرحباً بك</h1>
          <p className="mt-1 text-2xl text-muted-foreground">ابدأ رحلة التعلم اليوم</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="ابحث عن الدورات..." className="h-14 rounded-xl pr-12 text-right text-lg" dir="rtl" />
      </div>

      <div>
        <h2 className="mb-4 text-right text-3xl font-bold">التصنيفات</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="rounded-2xl">
              <CardContent className="flex min-h-[165px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="text-2xl font-semibold">{category.name}</h3>
                <p className="mt-2 text-xl text-muted-foreground">{category.courses} دورة</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-2xl">
            عرض الكل
          </Button>
          <h2 className="text-3xl font-bold">دوراتي</h2>
        </div>

        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4" dir="rtl">
            {myCourses.map((course) => (
              <Card key={course.id} className="min-w-[330px] rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-28 w-28 overflow-hidden rounded-2xl bg-muted">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-right">
                      <h3 className="mb-2 text-2xl font-semibold">{course.title}</h3>
                      <p className="mb-3 text-lg text-muted-foreground">{course.nextLesson}</p>
                      <div className="h-3 w-full rounded-full bg-muted">
                        <div
                          className="h-3 rounded-full bg-primary transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xl text-muted-foreground">{course.progress}% مكتمل</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-2xl">
            عرض الكل
          </Button>
          <h2 className="text-3xl font-bold">الدورات المميزة</h2>
        </div>

        <div className="space-y-5">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden rounded-2xl">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={420}
                    height={240}
                    className="h-64 w-full object-cover"
                  />

                  {course.isNew && (
                    <Badge className="absolute right-4 top-4 rounded-full bg-green-500 px-4 py-1 text-lg">
                      جديد
                    </Badge>
                  )}

                  <Button variant="secondary" size="icon" className="absolute left-4 top-4 rounded-2xl h-14 w-14">
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>

                <div className="p-5 text-right">
                  <h3 className="mb-3 text-3xl font-bold leading-snug">{course.title}</h3>
                  <p className="mb-3 text-2xl text-muted-foreground">بواسطة {course.instructor}</p>

                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xl text-muted-foreground">
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

                  <div className="flex items-end justify-between">
                    <div className="text-right">
                      <div className="text-4xl font-extrabold">{course.price}</div>
                      {course.originalPrice && (
                        <div className="text-2xl text-muted-foreground line-through">{course.originalPrice}</div>
                      )}
                    </div>

                    <Button className="rounded-xl px-8 py-6 text-2xl">
                      {course.isFree ? "ابدأ الآن" : "اشترك الآن"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const ExploreContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
          <Filter className="h-5 w-5" />
        </Button>
        <h1 className="text-right text-4xl font-bold">استكشف الدورات</h1>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="ابحث عن الدورات..." className="h-14 rounded-xl pr-12 text-right text-lg" dir="rtl" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid h-14 w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="paid" className="text-xl">مدفوعة</TabsTrigger>
          <TabsTrigger value="free" className="text-xl">مجانية</TabsTrigger>
          <TabsTrigger value="all" className="text-xl">الكل</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-right">
                    <h3 className="mb-2 text-3xl font-bold leading-snug">{course.title}</h3>
                    <p className="mb-2 text-2xl text-muted-foreground">بواسطة {course.instructor}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{course.price}</span>
                      <div className="flex items-center gap-1 text-2xl font-semibold">
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
              <Card key={course.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-right">
                      <h3 className="mb-2 text-3xl font-bold leading-snug">{course.title}</h3>
                      <p className="mb-2 text-2xl text-muted-foreground">بواسطة {course.instructor}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{course.price}</span>
                        <div className="flex items-center gap-1 text-2xl font-semibold">
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
              <Card key={course.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-right">
                      <h3 className="mb-2 text-3xl font-bold leading-snug">{course.title}</h3>
                      <p className="mb-2 text-2xl text-muted-foreground">بواسطة {course.instructor}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{course.price}</span>
                        <div className="flex items-center gap-1 text-2xl font-semibold">
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
    </div>
  )

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="pt-2 text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback className="text-2xl">
            {piUser?.username?.slice(0, 2) || "أح"}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-4xl font-bold">{piUser?.username || "أحمد محمد"}</h1>
        <p className="mt-2 text-2xl text-muted-foreground">مطور تطبيقات</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-5xl font-extrabold">12</p>
          <p className="mt-2 text-xl text-muted-foreground">دورة مكتملة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold">3</p>
          <p className="mt-2 text-xl text-muted-foreground">دورة منشورة</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold">4.8</p>
          <p className="mt-2 text-xl text-muted-foreground">تقييم المدرب</p>
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
          <Card key={item.title} className="rounded-2xl">
            <CardContent className="flex items-center justify-between p-5">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-3xl font-medium">{item.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <PiPanel />
    </div>
  )

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <AppHeader />

      <div className="px-4 pb-24 pt-6">
        {activeTab === "home" && <HomeContent />}
        {activeTab === "explore" && <ExploreContent />}
        {activeTab === "profile" && <ProfileContent />}
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background">
        <div className="grid grid-cols-3 gap-2 px-3 py-3">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="h-16 flex-col rounded-2xl text-base"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mb-1 h-5 w-5" />
            الملف الشخصي
          </Button>

          <Button
            variant={activeTab === "explore" ? "default" : "ghost"}
            className="h-16 flex-col rounded-2xl text-base"
            onClick={() => setActiveTab("explore")}
          >
            <Search className="mb-1 h-5 w-5" />
            استكشف
          </Button>

          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className="h-16 flex-col rounded-2xl text-base"
            onClick={() => setActiveTab("home")}
          >
            <BookOpen className="mb-1 h-5 w-5" />
            الرئيسية
          </Button>
        </div>
      </div>
    </div>
  )
      }
