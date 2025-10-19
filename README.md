# Project Management System - Frontend

Modern React-based frontend for the Project & Task Management System with AI features.

## Tech Stack

- **React.js** - UI library
- **React Router** - Navigation
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client
- **Lucide React** - Modern icons

## Features

✅ **Project Management**
- Create, edit, and delete projects
- View all projects in a grid layout
- Navigate to project task boards

✅ **Kanban Board**
- Visual task board with 3 columns (To Do, In Progress, Done)
- Drag and drop tasks between columns
- Real-time status updates

✅ **Task Management**
- Create, edit, and delete tasks
- Assign tasks to columns
- View task details

✅ **AI Features**
- Summarize all tasks in a project
- Ask questions about project tasks
- Get AI-powered insights

✅ **Modern UI**
- Responsive design
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Intuitive user experience

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ProjectList.js      # Project listing page
│   │   ├── ProjectModal.js     # Create/Edit project modal
│   │   ├── KanbanBoard.js      # Main kanban board
│   │   ├── TaskCard.js         # Individual task card
│   │   ├── TaskModal.js        # Create/Edit task modal
│   │   └── AIPanel.js          # AI features panel
│   ├── pages/                  # Page components (if needed)
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── styles/
│   │   └── App.css             # Global styles
│   ├── App.js                  # Main app component
│   └── index.js                # Entry point
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file in the client directory if you want to customize the API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

By default, the app uses the proxy configuration in `package.json` to connect to `http://localhost:5000`.

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Component Overview

### ProjectList
- Displays all projects in a grid
- Allows creating new projects
- Edit and delete existing projects
- Navigate to project kanban board

### KanbanBoard
- Main task management interface
- Three columns: To Do, In Progress, Done
- Drag and drop tasks between columns
- Create tasks directly in columns
- AI assistant panel

### TaskCard
- Draggable task component
- Shows task title and description
- Edit and delete actions
- Smooth drag animations

### AIPanel
- Summarize all project tasks
- Ask questions about tasks
- Display AI-generated responses
- Powered by Gemini AI

## Key Dependencies

- **react-router-dom**: Client-side routing
- **@dnd-kit/core**: Core drag and drop functionality
- **@dnd-kit/sortable**: Sortable list functionality
- **axios**: Promise-based HTTP client
- **lucide-react**: Beautiful icon library

## Usage Guide

### Creating a Project
1. Click "New Project" button on the home page
2. Fill in project name and description
3. Click "Create"

### Managing Tasks
1. Click on a project to open its kanban board
2. Click the "+" button in any column to create a task
3. Drag tasks between columns to change status
4. Click edit icon to modify task details
5. Click delete icon to remove a task

### Using AI Features
1. Click "Summarize Tasks" to get an AI-generated summary
2. Type a question in the input field and click "Ask"
3. View AI responses in the result panel

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (below 768px)

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Projects**: `/api/projects`
- **Tasks**: `/api/tasks`
- **AI**: `/api/ai`

All API calls are handled through the `services/api.js` module.

## Styling

The application uses custom CSS with:
- CSS Grid for layouts
- Flexbox for component alignment
- CSS animations and transitions
- Modern color palette
- Gradient backgrounds
- Box shadows for depth

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure the backend server has CORS enabled and is running on port 5000.

### API Connection Failed
Check that:
1. Backend server is running on `http://localhost:5000`
2. MongoDB is connected
3. Environment variables are set correctly

### Drag and Drop Not Working
Ensure you have the latest version of `@dnd-kit` packages installed.

## Next Steps

- Add user authentication
- Implement real-time updates with WebSockets
- Add task comments and attachments
- Implement task filtering and search
- Add task due dates and priorities
- Create task analytics dashboard
