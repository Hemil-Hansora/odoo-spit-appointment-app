"use client"

import { useState } from "react"
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

// Mock data
const bookings = [
  {
    id: "1",
    customer: "Alice Johnson",
    email: "alice@example.com",
    service: "Initial Consultation",
    time: "Dec 20, 2025 - 10:00 AM",
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Bob Smith",
    email: "bob@example.com",
    service: "Strategy Session",
    time: "Dec 21, 2025 - 02:00 PM",
    status: "pending",
  },
  {
    id: "3",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    service: "Technical Review",
    time: "Dec 22, 2025 - 11:00 AM",
    status: "cancelled",
  },
]

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
  day: string
  slots: TimeSlot[]
}

interface Question {
  id: string
  label: string
  answerType: string
  mandatory: boolean
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bookings")
  const [configTab, setConfigTab] = useState<ConfigTabType>("Schedule")
  const [bookType, setBookType] = useState<BookType>("User")
  const [assignment, setAssignment] = useState<AssignmentType>("Automatically")
  const [manualConfirmation, setManualConfirmation] = useState(false)
  const [paidBooking, setPaidBooking] = useState(false)
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "Monday", slots: [{ id: "1", start: "09:00", end: "12:00" }, { id: "2", start: "14:00", end: "17:00" }] },
    { day: "Tuesday", slots: [{ id: "3", start: "09:00", end: "17:00" }] },
    { day: "Wednesday", slots: [{ id: "4", start: "10:00", end: "12:00" }] },
  ])
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", label: "Name", answerType: "Single line text", mandatory: false },
    { id: "2", label: "Phone", answerType: "Phone number", mandatory: false },
    { id: "3", label: "Signature", answerType: "Single line text", mandatory: false },
  ])

  const addSlot = (day: string) => {
    setSchedule(prev => prev.map(d => 
      d.day === day 
        ? { ...d, slots: [...d.slots, { id: Date.now().toString(), start: "", end: "" }] }
        : d
    ))
  }

  const removeSlot = (day: string, slotId: string) => {
    setSchedule(prev => prev.map(d =>
      d.day === day
        ? { ...d, slots: d.slots.filter(s => s.id !== slotId) }
        : d
    ))
  }

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: Date.now().toString(),
      label: "",
      answerType: "Single line text",
      mandatory: false
    }])
  }

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

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

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-lg font-semibold text-gray-900">All Bookings</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                A list of all appointments including customer details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
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
                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${index === bookings.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <td className="px-6 py-4 align-middle">
                          <div className="font-medium text-gray-900">{booking.customer}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        </td>
                        <td className="px-6 py-4 align-middle text-gray-600">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 align-middle text-gray-600">
                          {booking.time}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <Badge
                            variant="outline"
                            className={
                              booking.status === "confirmed"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : booking.status === "pending"
                                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right align-middle">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <CardTitle className="text-lg font-semibold text-gray-900">Appointment Details</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Configure your appointment settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Appointment Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment title</label>
                    <Input
                      defaultValue="Dental care"
                      className="border-gray-300 bg-white"
                    />
                  </div>

                  {/* Duration and Location */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <Select defaultValue="00:30">
                        <SelectTrigger className="border-gray-300 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="00:15">00:15 Hours</SelectItem>
                          <SelectItem value="00:30">00:30 Hours</SelectItem>
                          <SelectItem value="01:00">01:00 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        defaultValue="Doctor's Office"
                        className="border-gray-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Book Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Book</label>
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

                  {/* Users */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Assigned Users</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-700">A1</Badge>
                      <Badge variant="outline" className="border-gray-300 bg-white text-gray-600">User 1</Badge>
                      <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-700">A2</Badge>
                      <Badge variant="outline" className="border-gray-300 bg-white text-gray-600">User 2</Badge>
                    </div>
                  </div>

                  {/* Assignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Assignment</label>
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
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    <label className="text-sm text-gray-700">
                      Allow 1 Simultaneous Appointment(s) per user
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
                      {schedule.map((daySchedule) => (
                        <div key={daySchedule.day} className="space-y-2">
                          {daySchedule.slots.map((slot, idx) => (
                            <div key={slot.id} className="grid grid-cols-[120px_1fr_80px] gap-4 items-center">
                              {idx === 0 && <div className="text-sm font-medium text-gray-900">{daySchedule.day}</div>}
                              {idx > 0 && <div></div>}
                              <div className="flex gap-2 items-center">
                                <Input
                                  defaultValue={slot.start}
                                  placeholder="00:00"
                                  className="border-gray-300 bg-white text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <Input
                                  defaultValue={slot.end}
                                  placeholder="00:00"
                                  className="border-gray-300 bg-white text-sm"
                                />
                              </div>
                              <button
                                onClick={() => removeSlot(daySchedule.day, slot.id)}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addSlot(daySchedule.day)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Add a line
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
                      {questions.map((question) => (
                        <div key={question.id} className="grid grid-cols-[1fr_200px_120px_80px] gap-4 items-center">
                          <Input
                            defaultValue={question.label}
                            className="border-gray-300 bg-white text-sm"
                          />
                          <Select defaultValue={question.answerType}>
                            <SelectTrigger className="border-gray-300 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single line text">Single line text</SelectItem>
                              <SelectItem value="Phone number">Phone number</SelectItem>
                              <SelectItem value="Email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Answer"
                            className="border-gray-300 bg-white text-sm"
                          />
                          <div className="flex items-center gap-4">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-gray-400 hover:text-gray-600 text-sm"
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
                          placeholder="Schedule your visit today and experience expert dental care brought right to your doorstep."
                          rows={3}
                          className="border-gray-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation page message</label>
                        <Textarea
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
                    <div className="text-4xl text-gray-400">📷</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-300">
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-500">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button className="w-full shadow-sm">Save Changes</Button>
                <Button variant="outline" className="w-full border-gray-300">Preview</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
