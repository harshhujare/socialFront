import React from "react";
import {
  FiCreditCard,
  FiGlobe,
  FiUser,
  FiShoppingCart,
} from "react-icons/fi";
import { useAuth } from "../../../context/authcontext";

const StatCard = ({ icon: Icon, label, value, delta, positive }) => {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
      <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-blue-200 text-xs">{label}</div>
        <div className="text-white text-xl font-semibold">{value}</div>
      </div>
      <div
        className={`text-xs ${positive ? "text-emerald-400" : "text-rose-400"}`}
      >
        {delta}
      </div>
    </div>
  );
};


const Gauge = ({ percent = 95 }) => {
  const stroke = 10;
  const r = 45;
  const c = Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg viewBox="0 0 120 70" className="w-full">
      <defs>
        <linearGradient id="gauge" x1="0" x2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M10,60 A50,50 0 0,1 110,60"
        fill="none"
        stroke="#1f2937"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d="M10,60 A50,50 0 0,1 110,60"
        fill="none"
        stroke="url(#gauge)"
        strokeWidth={stroke}
        strokeDasharray={`${c}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="60"
        y="55"
        textAnchor="middle"
        className="fill-white"
        fontSize="14"
        fontWeight="700"
      >
        {percent}%
      </text>
    </svg>
  );
};

const AreaChart = () => {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-48">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 180 C 80 120, 120 160, 200 140 C 280 120, 320 40, 400 60 C 480 80, 520 160, 600 140 L 600 220 L 0 220 Z"
        fill="url(#area)"
      />
      <path
        d="M0 180 C 80 120, 120 160, 200 140 C 280 120, 320 40, 400 60 C 480 80, 520 160, 600 140"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
      />
    </svg>
  );
};

const Bars = () => {
  const bars = [120, 80, 160, 60, 180, 130, 170, 110, 150, 90];
  return (
    <div className="flex items-end gap-3 w-full h-48">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-white/10 rounded-md overflow-hidden">
          <div
            className="bg-white/80"
            style={{ height: `${(h / 200) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="w-full flex items-center justify-center flex-col px-6 relative overflow-hidden">
      {/* Main content */}
      <main className="w-full p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={FiCreditCard}
            label="Today's Money"
            value="$53,000"
            delta="+55%"
            positive
          />
          <StatCard
            icon={FiGlobe}
            label="Today's Users"
            value="2,300"
            delta="+5%"
            positive
          />
          <StatCard
            icon={FiUser}
            label="New Clients"
            value="+3,052"
            delta="-14%"
          />
          <StatCard
            icon={FiShoppingCart}
            label="Total Sales"
            value="$173,000"
            delta="+8%"
            positive
          />
        </div>

        {/* Main cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome */}
              <div className="col-span-1 lg:col-span-2 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-700/40 via-indigo-500/10 to-transparent rounded-3xl border border-white/10 overflow-hidden">
                <div className="relative h-56 md:h-72">
                  <img
                    src="/assets/image.png"
                    alt="jellyfish"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <div className="relative z-10 p-6">
                    <div className="text-blue-100 text-sm">Welcome back,</div>
                    <div className="text-white text-2xl md:text-3xl font-extrabold">
                      {user?.fullname || 'Admin'}
                    </div>
                    <p className="text-blue-100 mt-2 max-w-md">
                      Glad to see you again! Ask me anything.
                    </p>
                    <button className="mt-6 inline-flex items-center gap-2 text-sm text-white bg-white/10 border border-white/20 px-4 py-2 rounded-xl">
                      Tap to record →
                    </button>
                  </div>
                </div>
              </div>

              {/* Satisfaction */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="text-blue-200 text-sm">Satisfaction Rate</div>
                <div className="text-blue-300 text-xs mb-4">
                  From all projects
                </div>
                <Gauge percent={22} />
              </div>
            </div>

            {/* Referral and gauge right group */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="text-blue-200 text-sm mb-4">
                  Referral Tracking
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-blue-300 text-xs">Invited</div>
                    <div className="text-white text-xl font-semibold">
                      145 people
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-blue-300 text-xs">Bonus</div>
                    <div className="text-white text-xl font-semibold">
                      1,465
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center">
                <div className="w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mr-6">
                  <div className="text-emerald-300 text-3xl font-bold">9.3</div>
                </div>
                <div>
                  <div className="text-blue-200 text-sm">Safety</div>
                  <div className="text-blue-300 text-xs">Total Score</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="text-blue-200 text-sm mb-2">Sales overview</div>
                <div className="text-emerald-400 text-xs mb-4">
                  (+5) more in 2021
                </div>
                <AreaChart />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <Bars />
              </div>
            </div>

            {/* Active Users */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="text-blue-200 text-sm">Active Users</div>
                <div className="text-blue-300 text-xs mb-4">
                  (+23) than last week
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Users", value: "32,984" },
                    { label: "Clicks", value: "2.42m" },
                    { label: "Sales", value: "2,400$" },
                    { label: "Items", value: "320" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4"
                    >
                      <div className="text-white font-semibold">{m.value}</div>
                      <div className="text-blue-300 text-xs">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="text-blue-200 text-sm mb-4">Your Balance</div>
                <div className="text-white text-3xl font-bold">$74,652</div>
                <div className="text-blue-300 text-xs mt-2">
                  Saved this month
                </div>
              </div>
            </div>
        
      </main>
    </div>
  );
};

export default Dashboard;
