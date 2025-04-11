
import React from 'react';
import { X, BarChart4, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMap } from '@/contexts/MapContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StatsPanelProps {
  onClose: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ onClose }) => {
  const { animals } = useMap();
  
  // Calculate type distribution
  const typeData = [
    { name: 'Cats', value: animals.filter(a => a.type === 'cat').length },
    { name: 'Dogs', value: animals.filter(a => a.type === 'dog').length },
    { name: 'Other', value: animals.filter(a => a.type === 'other').length },
  ].filter(item => item.value > 0);
  
  // Calculate status distribution
  const statusData = [
    { name: 'Needs Help', value: animals.filter(a => a.status === 'needs_help').length },
    { name: 'Being Helped', value: animals.filter(a => a.status === 'being_helped').length },
    { name: 'Adopted', value: animals.filter(a => a.status === 'adopted').length },
    { name: 'Reported', value: animals.filter(a => a.status === 'reported').length },
  ].filter(item => item.value > 0);
  
  // Create weekly data (simulated)
  const today = new Date();
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - 6 + i);
    
    // Simulated data based on actual animals count but distributed over the week
    const animalCount = Math.floor(Math.random() * (animals.length + 2));
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: animalCount
    };
  });
  
  const COLORS = ['#9B30FF', '#4169E1', '#32CD32', '#FFA500', '#FF4500'];
  
  return (
    <div className="relative animate-fade-in">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 mb-6 pr-8">
        <BarChart4 className="h-5 w-5" />
        <h2 className="text-xl font-bold">Statistics</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Animal Sightings Overview</h3>
            <Button variant="ghost" size="icon" title="More Information">
              <CircleHelp className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total Animals</p>
              <p className="text-2xl font-bold">{animals.length}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Need Help</p>
              <p className="text-2xl font-bold text-petmap-red">
                {animals.filter(a => a.status === 'needs_help').length}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Being Helped</p>
              <p className="text-2xl font-bold text-petmap-orange">
                {animals.filter(a => a.status === 'being_helped').length}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Adopted</p>
              <p className="text-2xl font-bold text-petmap-green">
                {animals.filter(a => a.status === 'adopted').length}
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-4">Animal Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-4">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-4">Weekly Sightings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#9B30FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
