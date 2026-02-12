import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProjectCard from './components/ProjectCard';
import ProjectTable from './components/ProjectTable';
import ProjectFilters from './components/ProjectFilters';
import ProjectModal from './components/ProjectModal';
import TaskModal from './components/TaskModal';
import KanbanBoard from './components/KanbanBoard';
import { toast } from "sonner";

const ProjectManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban', 'cards'
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({});

  // Mock data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      client: "TechCorp Solutions",
      description: "Complete redesign of the e-commerce platform with modern UI/UX and enhanced functionality",
      status: "Active",
      priority: "High",
      progress: 75,
      startDate: "2025-01-15",
      deadline: "2025-03-15",
      budget: 45000,
      createdAt: "2025-01-10",
      teamMembers: [
        { id: 1, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Project Manager" },
        { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg", role: "Frontend Developer" },
        { id: 3, name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/3.jpg", role: "UI/UX Designer" }
      ],
      deliverables: ["Homepage Redesign", "Product Pages", "Checkout Flow", "Mobile Optimization"],
      tasks: [
        {
          id: 101,
          title: "Design Homepage Mockups",
          description: "Create high-fidelity mockups for the new homepage design",
          status: "completed",
          priority: "High",
          assignee: { id: 3, name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
          dueDate: "2025-02-01",
          estimatedHours: 16,
          tags: ["design", "homepage"]
        },
        {
          id: 102,
          title: "Implement Product Catalog",
          description: "Develop the product catalog with filtering and search functionality",
          status: "in-progress",
          priority: "High",
          assignee: { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
          dueDate: "2025-02-15",
          estimatedHours: 32,
          tags: ["development", "catalog"]
        }
      ]
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "Digital Marketing Pro",
      description: "Native mobile application for iOS and Android with real-time analytics",
      status: "Planning",
      priority: "Medium",
      progress: 25,
      startDate: "2025-02-01",
      deadline: "2025-05-30",
      budget: 75000,
      createdAt: "2025-01-20",
      teamMembers: [
        { id: 4, name: "Alex Rodriguez", avatar: "https://randomuser.me/api/portraits/men/4.jpg", role: "Mobile Developer" },
        { id: 5, name: "Lisa Wang", avatar: "https://randomuser.me/api/portraits/women/5.jpg", role: "Backend Developer" }
      ],
      deliverables: ["iOS App", "Android App", "Backend API", "Admin Dashboard"],
      tasks: [
        {
          id: 201,
          title: "Setup Development Environment",
          description: "Configure development tools and project structure",
          status: "todo",
          priority: "Medium",
          assignee: { id: 4, name: "Alex Rodriguez", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
          dueDate: "2025-02-10",
          estimatedHours: 8,
          tags: ["setup", "environment"]
        }
      ]
    },
    {
      id: 3,
      name: "Brand Identity Package",
      client: "StartupXYZ",
      description: "Complete brand identity including logo, guidelines, and marketing materials",
      status: "On Hold",
      priority: "Low",
      progress: 40,
      startDate: "2025-01-05",
      deadline: "2025-02-28",
      budget: 15000,
      createdAt: "2025-01-01",
      teamMembers: [
        { id: 6, name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/6.jpg", role: "Brand Designer" }
      ],
      deliverables: ["Logo Design", "Brand Guidelines", "Business Cards", "Website Mockups"],
      tasks: [
        {
          id: 301,
          title: "Logo Concepts",
          description: "Create initial logo concepts and variations",
          status: "review",
          priority: "Medium",
          assignee: { id: 6, name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
          dueDate: "2025-02-05",
          estimatedHours: 12,
          tags: ["design", "logo"]
        }
      ]
    },
    {
      id: 4,
      name: "Data Analytics Dashboard",
      client: "E-commerce Plus",
      description: "Advanced analytics dashboard with real-time reporting and data visualization",
      status: "Completed",
      priority: "High",
      progress: 100,
      startDate: "2024-11-01",
      deadline: "2025-01-31",
      budget: 35000,
      createdAt: "2024-10-25",
      teamMembers: [
        { id: 7, name: "Rachel Green", avatar: "https://randomuser.me/api/portraits/women/7.jpg", role: "Data Analyst" },
        { id: 8, name: "Tom Wilson", avatar: "https://randomuser.me/api/portraits/men/8.jpg", role: "Full Stack Developer" }
      ],
      deliverables: ["Dashboard Interface", "Data Pipeline", "Reporting System", "User Documentation"],
      tasks: [
        {
          id: 401,
          title: "Deploy to Production",
          description: "Final deployment and monitoring setup",
          status: "completed",
          priority: "High",
          assignee: { id: 8, name: "Tom Wilson", avatar: "https://randomuser.me/api/portraits/men/8.jpg" },
          dueDate: "2025-01-30",
          estimatedHours: 6,
          tags: ["deployment", "production"]
        }
      ]
    }
  ]);

  const clients = [
    { id: 1, name: "TechCorp Solutions" },
    { id: 2, name: "Digital Marketing Pro" },
    { id: 3, name: "StartupXYZ" },
    { id: 4, name: "E-commerce Plus" },
    { id: 5, name: "Innovation Labs" }
  ];

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Project Manager" },
    { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg", role: "Frontend Developer" },
    { id: 3, name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/3.jpg", role: "UI/UX Designer" },
    { id: 4, name: "Alex Rodriguez", avatar: "https://randomuser.me/api/portraits/men/4.jpg", role: "Mobile Developer" },
    { id: 5, name: "Lisa Wang", avatar: "https://randomuser.me/api/portraits/women/5.jpg", role: "Backend Developer" },
    { id: 6, name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/6.jpg", role: "Brand Designer" },
    { id: 7, name: "Rachel Green", avatar: "https://randomuser.me/api/portraits/women/7.jpg", role: "Data Analyst" },
    { id: 8, name: "Tom Wilson", avatar: "https://randomuser.me/api/portraits/men/8.jpg", role: "Full Stack Developer" }
  ];

  // Filter projects based on active filters
  const filteredProjects = projects?.filter(project => {
    if (filters?.search && !project?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !project?.client?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }

    if (filters?.status && filters?.status !== 'all' && project?.status !== filters?.status) {
      return false;
    }

    if (filters?.client && filters?.client !== 'all' && project?.client !== filters?.client) {
      return false;
    }

    if (filters?.priority && filters?.priority !== 'all' && project?.priority !== filters?.priority) {
      return false;
    }

    if (filters?.teamMember && filters?.teamMember !== 'all') {
      const hasTeamMember = project?.teamMembers?.some(member => member?.name === filters?.teamMember);
      if (!hasTeamMember) return false;
    }

    if (filters?.dateRange && filters?.dateRange !== 'all') {
      const today = new Date();
      const deadline = new Date(project.deadline);

      switch (filters?.dateRange) {
        case 'today':
          if (deadline?.toDateString() !== today?.toDateString()) return false;
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (deadline > weekFromNow) return false;
          break;
        case 'month':
          const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          if (deadline > monthFromNow) return false;
          break;
        case 'overdue':
          if (deadline >= today) return false;
          break;
      }
    }

    return true;
  });

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleProjectSave = (projectData) => {
    if (selectedProject) {
      // Update existing project
      setProjects(prev => prev?.map(p => p?.id === selectedProject?.id ? { ...projectData, id: selectedProject?.id } : p));
    } else {
      // Create new project
      setProjects(prev => [...prev, { ...projectData, id: Date.now() }]);
    }
    setSelectedProject(null);
  };

  const handleProjectEdit = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleProjectView = (project) => {
    // In a real app, this would navigate to project details page
    console.log('View project:', project);
  };

  const handleProjectDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"?`)) {
      setProjects(prev => prev?.filter(p => p?.id !== project?.id));
    }
  };

  const handleTaskSave = (taskData) => {
    // Update the project with the new/updated task
    setProjects(prev => prev?.map(project => {
      if (project?.id?.toString() === taskData?.projectId) {
        const updatedTasks = selectedTask
          ? project?.tasks?.map(t => t?.id === selectedTask?.id ? taskData : t) || [taskData]
          : [...(project?.tasks || []), taskData];

        return { ...project, tasks: updatedTasks };
      }
      return project;
    }));
    setSelectedTask(null);
  };

  const handleTaskUpdate = (taskId, updates) => {
    setProjects(prev => prev?.map(project => ({
      ...project,
      tasks: project?.tasks?.map(task =>
        task?.id === taskId ? { ...task, ...updates } : task
      ) || []
    })));
  };

  const handleTaskCreate = (columnId) => {
    setSelectedTask({ status: columnId });
    setShowTaskModal(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Project Management', path: '/project-management', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={handleSidebarToggle}
      />
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-60' : 'lg:ml-60'}`}>
        <Header
          onMenuToggle={handleSidebarToggle}
          sidebarExpanded={sidebarExpanded}
        />

        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb customItems={breadcrumbItems} />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Project Management
                </h1>
                <p className="text-muted-foreground">
                  Manage your projects, track progress, and collaborate with your team
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleNewTask}
                >
                  <Icon name="Plus" size={16} />
                  New Task
                </Button>
                <Button onClick={handleNewProject}>
                  <Icon name="Plus" size={16} />
                  New Project
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                    <p className="text-2xl font-bold text-card-foreground">{projects?.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FolderKanban" size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {projects?.filter(p => p?.status === 'Active')?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {projects?.filter(p => p?.status === 'Completed')?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                    <p className="text-2xl font-bold text-card-foreground">{teamMembers?.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-secondary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <ProjectFilters
              onFilterChange={setFilters}
              activeFilters={filters}
            />

            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredProjects?.length} of {projects?.length} projects
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <Icon name="List" size={16} />
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    <Icon name="Grid3X3" size={16} />
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                  >
                    <Icon name="Kanban" size={16} />
                    Kanban
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="mb-8">
              {viewMode === 'list' && (
                <ProjectTable
                  projects={filteredProjects}
                  onEdit={handleProjectEdit}
                  onView={handleProjectView}
                  onDelete={handleProjectDelete}
                />
              )}

              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects?.map(project => (
                    <ProjectCard
                      key={project?.id}
                      project={project}
                      onEdit={handleProjectEdit}
                      onView={handleProjectView}
                    />
                  ))}
                  {filteredProjects?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-card-foreground mb-2">
                        No projects found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or create a new project.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'kanban' && (
                <KanbanBoard
                  projects={filteredProjects}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskCreate={handleTaskCreate}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      {/* Modals */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setSelectedProject(null);
        }}
        onSave={handleProjectSave}
        project={selectedProject}
        clients={clients}
      />
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        task={selectedTask}
        projects={projects}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default ProjectManagement;