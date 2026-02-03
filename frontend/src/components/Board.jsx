import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Alert, Dropdown, Spinner } from 'react-bootstrap';
import axios from 'axios';

// Helper for random colored avatars
const getAvatarColor = (name) => {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69', '#6610f2'];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
};

const Board = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // State Management
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showInvite, setShowInvite] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    // Form States
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteStatus, setInviteStatus] = useState({ type: '', msg: '' });
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo' });
    const [commentText, setCommentText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const user = JSON.parse(localStorage.getItem('user'));
    const columns = ['Todo', 'In Progress', 'Done'];

    useEffect(() => {
        const loadBoardData = async () => {
            setLoading(true);
            try {
                const [projRes, taskRes, userRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/projects/${user.id}`),
                    axios.get(`http://localhost:5000/api/tasks/${projectId}`),
                    axios.get('http://localhost:5000/api/users')
                ]);
                
                const currentProj = projRes.data.find(p => p._id === projectId);
                setProject(currentProj);
                setTasks(taskRes.data);
                setAllUsers(userRes.data);
            } catch (err) {
                console.error("Error loading board:", err);
            } finally {
                setLoading(false);
            }
        };
        loadBoardData();
    }, [projectId, user.id]);

    const fetchTasks = async () => {
        const res = await axios.get(`http://localhost:5000/api/tasks/${projectId}`);
        setTasks(res.data);
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/api/projects/${projectId}/invite`, { email: inviteEmail });
            setInviteStatus({ type: 'success', msg: res.data.message });
            setInviteEmail("");
            setTimeout(() => setShowInvite(false), 2000);
        } catch (err) {
            setInviteStatus({ type: 'danger', msg: err.response?.data?.error || "Invite failed" });
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title) return;
        try {
            await axios.post('http://localhost:5000/api/tasks', { ...newTask, project: projectId });
            setShowCreate(false);
            setNewTask({ title: '', description: '', status: 'Todo' });
            fetchTasks();
        } catch (err) {
            console.error("Error creating task", err);
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
        fetchTasks();
    };

    const handleAssign = async (userId) => {
        const res = await axios.patch(`http://localhost:5000/api/tasks/${selectedTask._id}/assign`, { userId });
        setSelectedTask(res.data);
        fetchTasks();
    };

    const handleAddComment = async () => {
        if (!commentText) return;
        const res = await axios.post(`http://localhost:5000/api/tasks/${selectedTask._id}/comment`, {
            user: user.name,
            text: commentText
        });
        setSelectedTask(res.data);
        setCommentText("");
        fetchTasks();
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-body">
            <Spinner animation="grow" variant="primary" />
        </div>
    );

    return (
        <div className="min-vh-100 pb-5 bg-body-tertiary">
            {/* --- TOP NAVBAR --- */}
            <div className="bg-body border-bottom py-3 mb-4 shadow-sm sticky-top">
                <Container fluid className="px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <Button variant="link" className="p-0 text-muted text-decoration-none fw-medium d-flex align-items-center gap-1" onClick={() => navigate('/dashboard')}>
                            <i className="bi bi-chevron-left"></i> Workspaces
                        </Button>
                        <div className="vr opacity-25"></div>
                        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                           <i className="bi bi-stack text-primary"></i>
                           {project?.name || "Project Board"}
                        </h4>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-primary" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => setShowInvite(true)}>
                            <i className="bi bi-person-plus"></i> Invite Team
                        </Button>
                        <Button variant="primary" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => setShowCreate(true)}>
                            <i className="bi bi-plus-lg"></i> New Task
                        </Button>
                    </div>
                </Container>
            </div>

            <Container fluid className="px-4">
                {/* --- SEARCHBAR --- */}
                <div className="mb-4 d-flex justify-content-start">
                    <div className="position-relative w-100" style={{ maxWidth: '400px' }}>
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <Form.Control
                            type="text"
                            placeholder="Filter engineering tasks..."
                            className="border-0 shadow-sm py-2 ps-5 rounded-pill bg-body"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- KANBAN COLUMNS --- */}
                <Row className="g-4">
                    {columns.map(col => {
                        const filteredTasks = tasks.filter(t => 
                            t.status === col && 
                            t.title.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        return (
                            <Col key={col} lg={4}>
                                <div className="kanban-column shadow-sm bg-body p-3 rounded-4" style={{ minHeight: '80vh' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                        <span className="fw-bold text-secondary small text-uppercase tracking-wider">
                                            {col === 'Todo' && <i className="bi bi-circle me-2"></i>}
                                            {col === 'In Progress' && <i className="bi bi-play-circle me-2 text-info"></i>}
                                            {col === 'Done' && <i className="bi bi-check-circle me-2 text-success"></i>}
                                            {col}
                                        </span>
                                        <Badge bg="primary-subtle" text="primary" className="rounded-pill px-3 py-2 border border-primary-subtle">
                                            {filteredTasks.length}
                                        </Badge>
                                    </div>

                                    <div className="task-list">
                                        {filteredTasks.map(task => {
                                            const assigneeName = typeof task.assignedTo === 'object' ? 
                                                task.assignedTo.name : 
                                                allUsers.find(u => u._id === task.assignedTo)?.name;

                                            return (
                                                <Card
                                                    key={task._id}
                                                    className="task-card mb-3 border-0 shadow-sm rounded-4 hover-shadow transition-all bg-body border-start border-4 border-primary"
                                                    onClick={() => { setSelectedTask(task); setShowDetail(true); }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <Card.Body className="p-3">
                                                        <h6 className="fw-bold mb-2 text-truncate">{task.title}</h6>
                                                        <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '0.85rem' }}>
                                                            {task.description || "System documented requirements..."}
                                                        </p>

                                                        <div className="d-flex justify-content-between align-items-center" onClick={(e) => e.stopPropagation()}>
                                                            {assigneeName ? (
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                                                                         style={{ width: '28px', height: '28px', fontSize: '11px', backgroundColor: getAvatarColor(assigneeName) }}>
                                                                        {assigneeName.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="small fw-medium text-muted" style={{ fontSize: '11px' }}>{assigneeName}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '11px' }}>
                                                                    <i className="bi bi-person-dash"></i> Unassigned
                                                                </div>
                                                            )}

                                                            <Dropdown align="end">
                                                                <Dropdown.Toggle variant="light" size="sm" className="rounded-pill border-0 bg-transparent text-muted no-caret shadow-none">
                                                                    <i className="bi bi-three-dots-vertical"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="shadow border-0 rounded-3 small">
                                                                    <Dropdown.Header className="text-muted fw-bold x-small py-1">UPDATE STATUS</Dropdown.Header>
                                                                    {columns.filter(c => c !== col).map(c => (
                                                                        <Dropdown.Item key={c} onClick={() => updateStatus(task._id, c)}>
                                                                            <i className="bi bi-arrow-right-short me-2"></i>Move to {c}
                                                                        </Dropdown.Item>
                                                                    ))}
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Container>

            {/* --- MODALS --- */}
            
            {/* Invite Teammate */}
            <Modal show={showInvite} onHide={() => setShowInvite(false)} centered className="rounded-4">
                <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <i className="bi bi-person-plus text-primary"></i> Invite Engineer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-body">
                    <p className="text-muted small mb-3">Add a collaborator to this workspace via email.</p>
                    {inviteStatus.msg && <Alert variant={inviteStatus.type} className="py-2 small border-0 shadow-sm">{inviteStatus.msg}</Alert>}
                    <Form onSubmit={handleInvite}>
                        <Form.Control 
                            type="email" 
                            placeholder="teammate@company.com" 
                            className="bg-body-tertiary border-0 py-2 mb-3 rounded-3 shadow-none"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required 
                        />
                        <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold py-2">Deploy Invitation</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Create Task */}
            <Modal show={showCreate} onHide={() => setShowCreate(false)} centered className="rounded-4">
                <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <i className="bi bi-plus-square text-primary"></i> Initialize Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-body">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Task Title</Form.Label>
                            <Form.Control type="text" className="bg-body-tertiary border-0 rounded-3 shadow-none py-2" placeholder="Define objective..." onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Technical Description</Form.Label>
                            <Form.Control as="textarea" rows={3} className="bg-body-tertiary border-0 rounded-3 shadow-none" placeholder="Provide context..." onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" className="w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={handleAddTask}>Add to Roadmap</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Task Details & Comments */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered className="rounded-4">
                <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
                    <Modal.Title className="fw-bold text-primary">{selectedTask?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-body">
                    <Row>
                        <Col md={8}>
                            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-2">Requirements</h6>
                            <p className="text-body bg-body-tertiary p-3 rounded-3 border-start border-4 border-primary shadow-sm">
                                {selectedTask?.description || "No specific requirements documented."}
                            </p>
                            <hr className="my-4 opacity-25" />
                            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-3 d-flex align-items-center gap-2">
                                <i className="bi bi-chat-left-dots"></i> Stream Activity
                            </h6>
                            <div className="mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {selectedTask?.comments?.map((c, i) => (
                                    <div key={i} className="mb-3 d-flex gap-2">
                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" 
                                             style={{width:'32px', height:'32px', fontSize:'12px'}}>
                                            {c.user.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="bg-body-tertiary p-2 px-3 rounded-3 w-100 shadow-sm border border-light-subtle">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold small">{c.user}</span>
                                                <span className="text-muted x-small" style={{fontSize:'10px'}}>{new Date(c.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="small text-secondary">{c.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex gap-2 bg-body-tertiary p-2 rounded-pill shadow-sm">
                                <Form.Control 
                                    className="bg-transparent border-0 shadow-none ps-3"
                                    placeholder="Post update..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <Button variant="primary" className="rounded-pill px-4 btn-sm" onClick={handleAddComment}>Send</Button>
                            </div>
                        </Col>
                        <Col md={4} className="border-start ps-4">
                            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-2">Assignee</h6>
                            <Form.Select className="bg-body-tertiary border-0 mb-4 py-2 rounded-3 shadow-none small" value={selectedTask?.assignedTo?._id || selectedTask?.assignedTo || ""} onChange={(e) => handleAssign(e.target.value)}>
                                <option value="">Select Resource</option>
                                {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </Form.Select>
                            <h6 className="fw-bold small text-muted text-uppercase tracking-wider mb-2">Status</h6>
                            <Badge bg="primary" className="w-100 py-3 rounded-pill shadow-sm fs-6 d-flex align-items-center justify-content-center gap-2">
                                <i className="bi bi-lightning-fill text-warning"></i> {selectedTask?.status}
                            </Badge>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Board;