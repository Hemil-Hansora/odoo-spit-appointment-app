import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CalendarPage() {
  // Mock calendar grid for a week view
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Calendar
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                View and manage your schedule
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">Previous Week</Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">Next Week</Button>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-6 text-center text-sm font-medium text-gray-700">
              <div className="py-3">Time</div>
              {days.map((day) => (
                <div key={day} className="border-l border-gray-200 py-3">
                  {day}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-6 divide-x divide-gray-200">
              {/* Time Column */}
              <div className="bg-gray-50">
                {hours.map((hour) => (
                  <div key={hour} className="h-20 border-b border-gray-200 flex items-center justify-center text-sm text-gray-600">
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {days.map((day, dayIndex) => (
                <div key={day} className="relative bg-white">
                  {hours.map((hour) => (
                    <div key={hour} className="h-20 border-b border-gray-100 relative group hover:bg-gray-50 transition-colors">
                      {/* Mock Appointment */}
                      {day === "Mon" && hour === 10 && (
                        <div className="absolute inset-1 bg-blue-500 text-white text-xs p-2 rounded shadow-sm z-10 overflow-hidden">
                          <div className="font-semibold">Consultation</div>
                          <div className="opacity-90">Alice Johnson</div>
                        </div>
                      )}
                      {day === "Wed" && hour === 14 && (
                        <div className="absolute inset-1 bg-green-500 text-white text-xs p-2 rounded shadow-sm z-10 overflow-hidden">
                          <div className="font-semibold">Strategy</div>
                          <div className="opacity-90">Bob Smith</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
