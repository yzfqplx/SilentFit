import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Trash2Icon, PlusIcon, CalendarIcon, RepeatIcon, BellIcon, ChevronRightIcon, WeightIcon } from '../components/icons/Icons';
import { XIcon, Layers, Hash } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const TrainingPlanPage: React.FC = () => {
    const { trainingPlanItems, addTrainingPlanItem, toggleTrainingPlanItem, deleteTrainingPlanItem, selectedTask, setSelectedTask } = useAppContext();
    const [newItemTitle, setNewItemTitle] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [repeat, setRepeat] = useState<string | undefined>();
    const [reminder, setReminder] = useState<Date | undefined>();
    const [weightKg, setWeightKg] = useState<number | undefined>();
    const [sets, setSets] = useState<number | undefined>();
    const [reps, setReps] = useState<number | undefined>();
    const [showCompleted, setShowCompleted] = useState(false); // New state for toggling completed tasks
    const listRef = useRef<HTMLUListElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const inputDrawerRef = useRef<HTMLDivElement>(null); // Ref for the input and drawer container

    const handleAddItem = () => {
        if (newItemTitle.trim() === '') return;
        addTrainingPlanItem(newItemTitle, dueDate, repeat, reminder, weightKg, sets, reps);
        setNewItemTitle('');
        setDueDate(undefined);
        setRepeat(undefined);
        setReminder(undefined);
        setWeightKg(undefined);
        setSets(undefined);
        setReps(undefined);
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        audioRef.current = new Audio('Microsoft To Do.wav');
    }, []);

    const handleToggleTrainingPlanItem = (id: string, completed: boolean) => {
        toggleTrainingPlanItem(id, completed);
        if (completed) { // If task is being marked as completed
            if (audioRef.current) {
                audioRef.current.currentTime = 0; // Reset audio to the beginning
                audioRef.current.play();
            }
        }
    };

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [trainingPlanItems]);


    const incompleteItems = trainingPlanItems.filter(item => !item.completed);
    const completedItems = trainingPlanItems.filter(item => item.completed);

    return (
        <div className="flex flex-col h-[calc(100vh-150px)]">
            <div className="p-4"> {/* Applied p-4 here */}
                <div ref={inputDrawerRef}> {/* Wrapper div with ref */}
                    <Card>
                        <CardContent className="p-2">
                            <div className="flex items-center gap-2">
                                <PlusIcon className="h-6 w-6 text-gray-400" />
                                <Input
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                    onFocus={() => setIsDrawerOpen(true)}
                                    placeholder="添加任务"
                                    onKeyUp={(e) => e.key === 'Enter' && handleAddItem()}
                                    className="flex-grow bg-transparent border-0 focus:ring-0"
                                />
                            </div>
                            {isDrawerOpen && (
                                <div className="mt-2 p-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                                    {/* First row: Date, Repeat, Reminder */}
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    {dueDate ? dueDate.toLocaleDateString() : '日期'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={dueDate}
                                                    onSelect={setDueDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <RepeatIcon className="h-4 w-4" />
                                                    {repeat || '重复'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => setRepeat('每天')}>每天</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => setRepeat('每周')}>每周</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => setRepeat('每月')}>每月</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <BellIcon className="h-4 w-4" />
                                                    {reminder ? reminder.toLocaleTimeString() : '提醒'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>暂不可用</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    {/* Second row: Weight, Sets, Reps */}
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <WeightIcon className="h-4 w-4" />
                                                    {weightKg ? `${weightKg}kg` : '重量'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2">
                                                <Input
                                                    type="number"
                                                    placeholder="重量(kg)"
                                                    value={weightKg || ''}
                                                    onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : undefined)}
                                                    min="0"
                                                    step="0.5"
                                                    autoFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <Layers className="h-4 w-4" />
                                                    {sets ? `${sets}组` : '组数'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2">
                                                <Input
                                                    type="number"
                                                    placeholder="组数"
                                                    value={sets || ''}
                                                    onChange={(e) => setSets(e.target.value ? Number(e.target.value) : undefined)}
                                                    min="1"
                                                    autoFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                                    <Hash className="h-4 w-4" />
                                                    {reps ? `${reps}次` : '次数'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2">
                                                <Input
                                                    type="number"
                                                    placeholder="次数"
                                                    value={reps || ''}
                                                    onChange={(e) => setReps(e.target.value ? Number(e.target.value) : undefined)}
                                                    min="1"
                                                    autoFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {isDrawerOpen && newItemTitle && (
                                        <Button onClick={handleAddItem} size="sm" className="w-full">添加</Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div> {/* End of Wrapper div */}
            </div>
            <div className="flex-grow p-4 space-y-2"> {/* Applied p-4 here */}
                <ul ref={listRef} className="space-y-2 hide-scrollbar"> {/* Removed p-4 from ul */}
                    {incompleteItems.map(item => (
                        <Card key={item._id} className="p-2">
                            <li
                                className={`flex items-center gap-2 transition-colors`}
                            >
                                <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() => handleToggleTrainingPlanItem(item._id!, !item.completed)}
                                />
                                <span
                                    className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}
                                    onClick={() => {
                                        setSelectedTask(item);
                                        setIsDrawerOpen(false);
                                    }}
                                >
                                    {item.title}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => deleteTrainingPlanItem(item._id!)}>
                                    <Trash2Icon className="h-4 w-4 text-gray-500" />
                                </Button>
                            </li>
                        </Card>
                    ))}
                </ul>
                {completedItems.length > 0 && (
                    <div>
                        <Button variant="ghost" onClick={() => setShowCompleted(!showCompleted)} className="w-full justify-start">
                            <ChevronRightIcon className={`h-4 w-4 transition-transform duration-200 ${showCompleted ? 'rotate-90' : ''}`} />
                            <span className="ml-2">已完成 <span className="text-gray-500">{completedItems.length}</span></span>
                        </Button>
                        {showCompleted && (
                            <ul className="space-y-2 mt-2">
                                {completedItems.map(item => (
                                    <Card key={item._id} className="p-2 opacity-50">
                                        <li
                                            className={`flex items-center gap-2 transition-colors`}
                                        >
                                            <Checkbox
                                                checked={item.completed}
                                                onCheckedChange={() => handleToggleTrainingPlanItem(item._id!, !item.completed)}
                                            />
                                            <span
                                                className="flex-1 line-through text-gray-500"
                                                onClick={() => {
                                                    setSelectedTask(item);
                                                    setIsDrawerOpen(false);
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                            <Button variant="ghost" size="icon" onClick={() => deleteTrainingPlanItem(item._id!)}>
                                                <Trash2Icon className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </li>
                                    </Card>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {selectedTask && (
                <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>任务详情</SheetTitle>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            </SheetClose>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                            <p>
                                <span className="font-semibold">标题:</span> {selectedTask.title}
                            </p>
                            <p>
                                <span className="font-semibold">状态:</span> {selectedTask.completed ? '已完成' : '未完成'}
                            </p>
                            {selectedTask.dueDate && (
                                <p>
                                    <span className="font-semibold">截止日期:</span> {new Date(selectedTask.dueDate).toLocaleDateString()}
                                </p>
                            )}
                            {selectedTask.repeat && (
                                <p>
                                    <span className="font-semibold">重复:</span> {selectedTask.repeat}
                                </p>
                            )}
                            {selectedTask.reminder && (
                                <p>
                                    <span className="font-semibold">提醒:</span> {new Date(selectedTask.reminder).toLocaleString()}
                                </p>
                            )}
                            {selectedTask.weightKg !== undefined && (
                                <p>
                                    <span className="font-semibold">重量:</span> {selectedTask.weightKg} kg
                                </p>
                            )}
                            {selectedTask.sets !== undefined && (
                                <p>
                                    <span className="font-semibold">组数:</span> {selectedTask.sets}
                                </p>
                            )}
                            {selectedTask.reps !== undefined && (
                                <p>
                                    <span className="font-semibold">次数:</span> {selectedTask.reps}
                                </p>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};

export default TrainingPlanPage;
