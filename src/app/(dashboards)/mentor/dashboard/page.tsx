"use client";

export default function MentorDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mentor Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your sessions and mentees.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Upcoming Sessions</h3>
            <p className="text-sm text-slate-500 mt-2">View your scheduled mentoring sessions.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Mentee Progress</h3>
            <p className="text-sm text-slate-500 mt-2">Track the skill growth of your mentees.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Availability</h3>
            <p className="text-sm text-slate-500 mt-2">Manage your calendar and slots.</p>
        </div>
      </div>
    </div>
  );
}
