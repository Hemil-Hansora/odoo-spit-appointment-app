"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TabType = "bookings" | "config"
type ConfigTabType = "Schedule" | "Questions" | "Options" | "Misc"
type BookType = "User" | "Resources"
type AssignmentType = "Automatically" | "By visitor"

interface TimeSlot {
  id: string
  start: string
  end: string
}

interface DaySchedule {
  id: string
  day: string
  dayOfWeek: number
  slots: TimeSlot[]
}

interface Question {
  id: string
  label: string
  answerType: string
  mandatory: boolean
}

interface Booking {
  id: string
  user: {
    name: string
    email: string
  }
  service: {
    title: string
  }
  slot: {
    date: string
    startTime: string
    endTime: string
  }
  status: string
}

interface ServiceData {
  id: string
  title: string
  description: string | null
  durationMinutes: number
  isPublished: boolean
  maxCapacity: number | null
  manualConfirm: boolean
  advancePayment: boolean
  metadata: {
    location?: string
    bookType?: BookType
    assignmentType?: AssignmentType
    maxSimultaneousAppointments?: number
    cancellationPolicy?: string
    timeSlotDuration?: string
    introMessage?: string
    confirmationMessage?: string
    image?: string
  }
  schedules: Array<{
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  questions: Array<{
    id: string
    label: string
    required: boolean
  }>
  resources: Array<{
    id: string
    name: string
  }>
}

const DAY_NAMES = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bookings")
  const [configTab, setConfigTab] = useState<ConfigTabType>("Schedule")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Service data
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [location, setLocation] = useState("")
  const [bookType, setBookType] = useState<BookType>("User")
  const [assignment, setAssignment] = useState<AssignmentType>("Automatically")
  const [maxSimultaneous, setMaxSimultaneous] = useState(1)
  const [manualConfirmation, setManualConfirmation] = useState(false)
  const [paidBooking, setPaidBooking] = useState(false)
  const [cancellationPolicy, setCancellationPolicy] = useState("01:00")
  const [introMessage, setIntroMessage] = useState("")
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  // Bookings data
  const [bookings, setBookings] = useState<Booking[]>([])
  
  // Schedules
  const [schedules, setSchedules] = useState<DaySchedule[]>([])
  
  // Questions
  const [questions, setQuestions] = useState<Question[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch user session and organization ID
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.session?.user?.organizationId) {
            setOrganizationId(data.session.user.organizationId)
          }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err)
      }
    }
    fetchSession()
  }, [])

  // Fetch bookings
  useEffect(() => {
    if (activeTab === "bookings" && organizationId) {
      fetchBookings()
    }
  }, [activeTab, organizationId])

  // Fetch service configuration
  useEffect(() => {
    if (activeTab === "config" && organizationId) {
      fetchServiceConfig()
    }
  }, [activeTab, organizationId])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/organiser/bookings?organizationId=${organizationId}`
      )
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceConfig = async () => {
    try {
      setLoading(true)
      // First, fetch services to get the first service ID
      const servicesRes = await fetch(
        `/api/organiser/services?organizationId=${organizationId}`
      )
      if (!servicesRes.ok) throw new Error("Failed to fetch services")
      const servicesData = await servicesRes.json()
      
      if (servicesData.services && servicesData.services.length > 0) {
        const firstService = servicesData.services[0]
        setServiceId(firstService.id)
        
        // Fetch full config for this service
        const configRes = await fetch(
          `/api/organiser/services/${firstService.id}/config`
        )
        if (!configRes.ok) throw new Error("Failed to fetch service config")
        const configData = await configRes.json()
        
        loadServiceData(configData.service)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load configuration"
      )
    } finally {
      setLoading(false)
    }
  }

  const loadServiceData = (service: ServiceData) => {
    setTitle(service.title || "")
    setDescription(service.description || "")
    setDuration(service.durationMinutes.toString())
    setLocation(service.metadata?.location || "")
    setBookType((service.metadata?.bookType as BookType) || "User")
    setAssignment(
      (service.metadata?.assignmentType as AssignmentType) || "Automatically"
    )
    setMaxSimultaneous(service.metadata?.maxSimultaneousAppointments || 1)
    setManualConfirmation(service.manualConfirm || false)
    setPaidBooking(service.advancePayment || false)
    setCancellationPolicy(service.metadata?.cancellationPolicy || "01:00")
    setIntroMessage(service.metadata?.introMessage || "")
    setConfirmationMessage(service.metadata?.confirmationMessage || "")
    setImageUrl(service.metadata?.image || null)

    // Load schedules
    const schedulesMap = new Map<number, TimeSlot[]>()
    service.schedules.forEach((s) => {
      const slots = schedulesMap.get(s.dayOfWeek) || []
      slots.push({ id: s.id, start: s.startTime, end: s.endTime })
      schedulesMap.set(s.dayOfWeek, slots)
    })

    setSchedules(
      Array.from(schedulesMap.entries()).map(([dayOfWeek, slots]) => ({
        id: `schedule-${dayOfWeek}`,
        day: DAY_NAMES[dayOfWeek as keyof typeof DAY_NAMES],
        dayOfWeek,
        slots,
      }))
    )

    // Load questions
    setQuestions(
      service.questions.map((q) => ({
        id: q.id,
        label: q.label,
        answerType: "Single line text",
        mandatory: q.required,
      }))
    )
  }

  const updateSlot = (scheduleId: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              slots: s.slots.map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : s
      )
    )
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === index
          ? {
              ...q,
              [field]: value,
              // Map UI field to DB field
              ...(field === "text" && { label: value }),
              ...(field === "type" && { answerType: value }),
            }
          : q
      )
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !serviceId) return

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        `/api/organiser/services/${serviceId}/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!serviceId) return

    try {
      setSaving(true)
      const response = await fetch(
        `/api/organiser/services/${serviceId}/upload-image`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Failed to remove image")

      setImageUrl(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!serviceId) {
      setError("No service selected")
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Save service configuration
      const configResponse = await fetch(
        `/api/organiser/services/${serviceId}/config`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            durationMinutes: parseInt(duration),
            location,
            bookType,
            assignmentType: assignment,
            maxSimultaneousAppointments: maxSimultaneous,
            manualConfirm: manualConfirmation,
            advancePayment: paidBooking,
            cancellationPolicy,
            timeSlotDuration: duration,
            introMessage,
            confirmationMessage,
          }),
        }
      )

      if (!configResponse.ok) throw new Error("Failed to save configuration")

      // Save schedules
      const schedulesToSave = schedules.flatMap((day) =>
        day.slots
          .filter((slot) => slot.start && slot.end)
          .map((slot) => ({
            dayOfWeek: day.dayOfWeek,
            startTime: slot.start,
            endTime: slot.end,
          }))
      )

      const schedulesResponse = await fetch(
        "/api/organiser/schedules/batch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId,
            schedules: schedulesToSave,
          }),
        }
      )

      if (!schedulesResponse.ok) throw new Error("Failed to save schedules")

      // Save questions
      const questionsToSave = questions
        .filter((q) => q.label.trim())
        .map((q) => ({
          label: q.label,
          required: q.mandatory,
          answerType: q.answerType,
        }))

      const questionsResponse = await fetch(
        "/api/organiser/questions/batch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId,
            questions: questionsToSave,
          }),
        }
      )

      if (!questionsResponse.ok) throw new Error("Failed to save questions")

      alert("Changes saved successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const formatBookingTime = (date: string, startTime: string) => {
    const d = new Date(date)
    const t = new Date(startTime)
    return `${d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${t.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`
  }

  const addSlot = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              slots: [
                ...s.slots,
                { id: Date.now().toString(), start: "09:00", end: "17:00" },
              ],
            }
          : s
      )
    );
  };

  const removeSlot = (scheduleId: string, slotIndex: number) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              slots: s.slots.filter((_, idx) => idx !== slotIndex),
            }
          : s
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: "",
        answerType: "text",
        mandatory: false,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Appointments
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage bookings and configure appointment settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "bookings" ? "default" : "outline"}
              onClick={() => setActiveTab("bookings")}
              className="shadow-sm"
            >
              Bookings
            </Button>
            <Button
              variant={activeTab === "config" ? "default" : "outline"}
              onClick={() => setActiveTab("config")}
              className="shadow-sm"
            >
              Configuration
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-lg font-semibold text-gray-900">
                All Bookings
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                A list of all appointments including customer details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-gray-500">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                          Service
                        </th>
                        <th className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                          Time
                        </th>
                        <th className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                          Status
                        </th>
                        <th className="h-12 px-6 text-right align-middle font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr
                          key={booking.id}
                          className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                            index === bookings.length - 1 ? "border-b-0" : ""
                          }`}
                        >
                          <td className="px-6 py-4 align-middle">
                            <div className="font-medium text-gray-900">
                              {booking.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle text-gray-600">
                            {booking.service.title}
                          </td>
                          <td className="px-6 py-4 align-middle text-gray-600">
                            {formatBookingTime(
                              booking.slot.date,
                              booking.slot.startTime
                            )}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <Badge
                              variant="outline"
                              className={
                                booking.status === "CONFIRMED"
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : booking.status === "PENDING"
                                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                  : "border-red-200 bg-red-50 text-red-700"
                              }
                            >
                              {booking.status.charAt(0) +
                                booking.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right align-middle">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuration Tab */}
        {activeTab === "config" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Appointment Details Card */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Appointment Details
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Configure your appointment settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Appointment Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment title
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter appointment title"
                      className="border-gray-300 bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter appointment description"
                      rows={3}
                      className="border-gray-300 bg-white"
                    />
                  </div>

                  {/* Duration and Location */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <Select value={duration} onValueChange={(value) => value && setDuration(value)}>
                        <SelectTrigger className="border-gray-300 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Minutes</SelectItem>
                          <SelectItem value="30">30 Minutes</SelectItem>
                          <SelectItem value="45">45 Minutes</SelectItem>
                          <SelectItem value="60">1 Hour</SelectItem>
                          <SelectItem value="90">1.5 Hours</SelectItem>
                          <SelectItem value="120">2 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        className="border-gray-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Book Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Book
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookType("User")}
                        className={cn(
                          "rounded border px-4 py-2 text-sm transition-colors",
                          bookType === "User"
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        User
                      </button>
                      <button
                        onClick={() => setBookType("Resources")}
                        className={cn(
                          "rounded border px-4 py-2 text-sm transition-colors",
                          bookType === "Resources"
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        Resources
                      </button>
                    </div>
                  </div>

                  {/* Assignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Assignment
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAssignment("Automatically")}
                        className={cn(
                          "rounded border px-4 py-2 text-sm transition-colors",
                          assignment === "Automatically"
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        Automatically
                      </button>
                      <button
                        onClick={() => setAssignment("By visitor")}
                        className={cn(
                          "rounded border px-4 py-2 text-sm transition-colors",
                          assignment === "By visitor"
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        By visitor
                      </button>
                    </div>
                  </div>

                  {/* Manage Capacity */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm text-gray-700">
                      Allow {maxSimultaneous} Simultaneous Appointment(s) per
                      user
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Tabs Card */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex gap-2">
                    {(["Schedule", "Questions", "Options", "Misc"] as ConfigTabType[]).map((tab) => (
                      <Button
                        key={tab}
                        variant={configTab === tab ? "default" : "outline"}
                        onClick={() => setConfigTab(tab)}
                        size="sm"
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {configTab === "Schedule" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-[120px_1fr_80px] gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-700">
                        <div>Every</div>
                        <div>From - To</div>
                        <div></div>
                      </div>
                      {schedules.map((daySchedule) => (
                        <div key={daySchedule.id} className="space-y-2">
                          {daySchedule.slots.map((slot, idx) => (
                            <div key={idx} className="grid grid-cols-[120px_1fr_80px] gap-4 items-center">
                              {idx === 0 && <div className="text-sm font-medium text-gray-900">{DAY_NAMES[daySchedule.dayOfWeek as keyof typeof DAY_NAMES]}</div>}
                              {idx > 0 && <div></div>}
                              <div className="flex gap-2 items-center">
                                <Input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) => updateSlot(daySchedule.id, idx, "start", e.target.value)}
                                  placeholder="09:00"
                                  className="border-gray-300 bg-white text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <Input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) => updateSlot(daySchedule.id, idx, "end", e.target.value)}
                                  placeholder="17:00"
                                  className="border-gray-300 bg-white text-sm"
                                />
                              </div>
                              <button
                                onClick={() => removeSlot(daySchedule.id, idx)}
                                className="text-red-600 hover:text-red-700 font-semibold"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addSlot(daySchedule.id)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 ml-[120px]"
                          >
                            <span className="text-lg">+</span> Add hours
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {configTab === "Questions" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr_200px_120px_80px] gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-700">
                        <div>Question</div>
                        <div>Answer Type</div>
                        <div>Answer</div>
                        <div>Mandatory</div>
                      </div>
                      {questions.map((question, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_200px_120px_80px] gap-4 items-center">
                          <Input
                            value={question.label}
                            onChange={(e) => updateQuestion(idx, "label", e.target.value)}
                            placeholder="Question"
                            className="border-gray-300 bg-white text-sm"
                          />
                          <Select
                            value={question.answerType}
                            onValueChange={(value) => updateQuestion(idx, "answerType", value)}
                          >
                            <SelectTrigger className="border-gray-300 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Single line text</SelectItem>
                              <SelectItem value="textarea">Multiple lines text</SelectItem>
                              <SelectItem value="number">Phone number</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Answer"
                            className="border-gray-300 bg-white text-sm"
                            disabled
                          />
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={question.mandatory}
                              onChange={(e) => updateQuestion(idx, "mandatory", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <button
                              onClick={() => removeQuestion(idx)}
                              className="text-red-600 hover:text-red-700 font-semibold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addQuestion}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add a question
                      </button>
                    </div>
                  )}

                  {configTab === "Options" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={manualConfirmation}
                            onChange={(e) => setManualConfirmation(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label className="text-sm text-gray-700">Manual confirmation</label>
                          <span className="text-xs text-gray-500">(Up to 50% of capacity)</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={paidBooking}
                            onChange={(e) => setPaidBooking(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label className="text-sm text-gray-700">Paid Booking</label>
                          <span className="text-sm text-gray-600">(Rs 200 per booking)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cancellation</label>
                        <p className="text-sm text-gray-600">Up to 01:00 hours before the booking</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Time Slot Duration</label>
                        <p className="text-sm text-gray-600">00:30 hours</p>
                      </div>
                    </div>
                  )}

                  {configTab === "Misc" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Introduction page message</label>
                        <Textarea
                          value={introMessage}
                          onChange={(e) => setIntroMessage(e.target.value)}
                          placeholder="Schedule your visit today and experience expert dental care brought right to your doorstep."
                          rows={3}
                          className="border-gray-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation page message</label>
                        <Textarea
                          value={confirmationMessage}
                          onChange={(e) => setConfirmationMessage(e.target.value)}
                          placeholder="Thank you for your trust we look forward to meeting you"
                          rows={3}
                          className="border-gray-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Picture Upload */}
            <div className="space-y-6">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-sm font-semibold text-gray-900">Picture</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Service"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">📷</div>
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload
                      </Button>
                      {imageUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-red-600 hover:text-red-700"
                          onClick={handleRemoveImage}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full shadow-sm"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" className="w-full border-gray-300">
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
