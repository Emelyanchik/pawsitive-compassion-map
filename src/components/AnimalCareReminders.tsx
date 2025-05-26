
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Bell, Clock, Calendar, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareReminder {
  id: string;
  title: string;
  description: string;
  type: 'feeding' | 'medication' | 'exercise' | 'grooming' | 'checkup';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  recurring: boolean;
  animalId?: string;
}

const AnimalCareReminders: React.FC = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<CareReminder[]>([
    {
      id: '1',
      title: 'Morning Feeding',
      description: 'Feed Max his breakfast - 2 cups of dry food',
      type: 'feeding',
      priority: 'high',
      dueDate: '2024-01-20T08:00:00',
      completed: false,
      recurring: true,
      animalId: 'max'
    },
    {
      id: '2',
      title: 'Pain Medication',
      description: 'Give Bella her arthritis medication',
      type: 'medication',
      priority: 'high',
      dueDate: '2024-01-20T12:00:00',
      completed: false,
      recurring: true,
      animalId: 'bella'
    },
    {
      id: '3',
      title: 'Weekly Grooming',
      description: 'Brush Charlie and check for any skin issues',
      type: 'grooming',
      priority: 'medium',
      dueDate: '2024-01-21T14:00:00',
      completed: true,
      recurring: true,
      animalId: 'charlie'
    }
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder && !reminder.completed) {
      toast({
        title: "Reminder Completed",
        description: `Marked "${reminder.title}" as completed.`,
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feeding': return '🍽️';
      case 'medication': return '💊';
      case 'exercise': return '🏃';
      case 'grooming': return '✂️';
      case 'checkup': return '🩺';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" | "outline" | "success" | "warning" | "info" | "purple" => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return 'Overdue';
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };

  const pendingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Care Reminders
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pending Reminders */}
          {pendingReminders.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Pending ({pendingReminders.length})
              </h3>
              {pendingReminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`p-3 rounded-lg border ${
                    isOverdue(reminder.dueDate) 
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={reminder.completed}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(reminder.type)}</span>
                          <h4 className="font-medium text-sm">{reminder.title}</h4>
                          {isOverdue(reminder.dueDate) && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(reminder.priority)} className="text-xs">
                            {reminder.priority}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span className={isOverdue(reminder.dueDate) ? 'text-red-600 font-medium' : ''}>
                              {formatDueDate(reminder.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{reminder.description}</p>
                      {reminder.recurring && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Completed Today ({completedReminders.length})
              </h3>
              {completedReminders.slice(0, 3).map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg opacity-50">{getTypeIcon(reminder.type)}</span>
                        <h4 className="font-medium text-sm text-green-800 dark:text-green-200 line-through">
                          {reminder.title}
                        </h4>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {reminder.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingReminders.length === 0 && completedReminders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No reminders set</p>
              <p className="text-xs">Add reminders to keep track of animal care tasks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalCareReminders;
