
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 12500, subscriptions: 45 },
  { month: 'Feb', revenue: 15200, subscriptions: 52 },
  { month: 'Mar', revenue: 18100, subscriptions: 68 },
  { month: 'Apr', revenue: 22300, subscriptions: 78 },
  { month: 'May', revenue: 25600, subscriptions: 85 },
  { month: 'Jun', revenue: 28900, subscriptions: 92 },
];

const userGrowthData = [
  { month: 'Jan', students: 1200, instructors: 45 },
  { month: 'Feb', students: 1450, instructors: 48 },
  { month: 'Mar', students: 1720, instructors: 52 },
  { month: 'Apr', students: 2100, instructors: 58 },
  { month: 'May', students: 2480, instructors: 63 },
  { month: 'Jun', students: 2850, instructors: 68 },
];

const coursePerformanceData = [
  { category: 'Web Development', courses: 42, avgRating: 4.5, enrollments: 1250 },
  { category: 'Data Science', courses: 28, avgRating: 4.3, enrollments: 890 },
  { category: 'Design', courses: 35, avgRating: 4.6, enrollments: 670 },
  { category: 'Business', courses: 24, avgRating: 4.2, enrollments: 520 },
  { category: 'Marketing', courses: 18, avgRating: 4.4, enrollments: 380 },
];

const engagementData = [
  { name: 'Course Completion', value: 68, color: '#8884d8' },
  { name: 'Video Watch Time', value: 82, color: '#82ca9d' },
  { name: 'Quiz Participation', value: 75, color: '#ffc658' },
  { name: 'Discussion Activity', value: 45, color: '#ff7c7c' },
];

export const RevenueChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value, name) => [
        name === 'revenue' ? `$${value.toLocaleString()}` : value,
        name === 'revenue' ? 'Revenue' : 'Subscriptions'
      ]} />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="revenue" 
        stackId="1" 
        stroke="#8884d8" 
        fill="#8884d8" 
        fillOpacity={0.6}
        name="Revenue ($)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const UserGrowthChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={userGrowthData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="students" 
        stroke="#8884d8" 
        strokeWidth={2}
        name="Students"
      />
      <Line 
        type="monotone" 
        dataKey="instructors" 
        stroke="#82ca9d" 
        strokeWidth={2}
        name="Instructors"
      />
    </LineChart>
  </ResponsiveContainer>
);

export const CoursePerformanceChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={coursePerformanceData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
      <Bar dataKey="courses" fill="#82ca9d" name="Courses" />
    </BarChart>
  </ResponsiveContainer>
);

export const EngagementChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={engagementData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {engagementData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [`${value}%`]} />
    </PieChart>
  </ResponsiveContainer>
);
