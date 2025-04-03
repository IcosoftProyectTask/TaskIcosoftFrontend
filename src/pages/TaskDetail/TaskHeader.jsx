import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Tag, MoreHorizontal, Calendar, Clock } from 'lucide-react';

const TaskHeader = ({ task, getPriorityColor, getStatusColor, getFormattedDate }) => {
    if (!task) return null;

    return (
        <Card className="shadow-md dark:bg-gray-900 border-0 overflow-hidden">
            <div className={`h-2 w-full ${getPriorityColor(task?.priority?.name)}`}></div>
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <CardTitle className="text-2xl font-bold dark:text-white">{task.title}</CardTitle>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getPriorityColor(task?.priority?.name)}>
                        <AlertCircle className="w-3 h-3 mr-1" /> Prioridad: {task.priority.name}
                    </Badge>
                    <Badge className={getStatusColor(task?.statusTask?.name)} style={{ color: 'black' }}>
                        Estado: {task.statusTask.name}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> Creada: {getFormattedDate(task.createdAt)}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Fecha límite: {getFormattedDate(task.endTask)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskHeader;
