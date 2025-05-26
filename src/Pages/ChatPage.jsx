
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const ChatPage = () => {
    const { chatId: receiverId } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [receiverName, setReceiverName] = useState('User');
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    // Verify and refresh token
    const token = localStorage.getItem('token');
    if (!token) {
        enqueueSnackbar('Please login to continue', { variant: 'error' });
        navigate('/login');
        return false;
    }

    // Initialize chat with token verification
    useEffect(() => {

        console.log('use param id', receiverId)
        const initChat = async () => {
            setIsLoading(true);
            // const isVerified = await verifyToken();
            // if (!isVerified) return;

            setIsAuthenticated(true);
            try {
                // Fetch receiver details
                const userRes = await axios.get(`${BACKEND_API}/user/${receiverId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });


                setReceiverName(userRes.data.name || 'User');

                // Fetch chat history
                const chatRes = await axios.get(`${BACKEND_API}/user/messages`, {
                    params: {
                        senderId: localStorage.getItem('userId'),
                        receiverId
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessages(chatRes.data.map(msg => ({
                    ...msg,
                    sender: msg.senderId === localStorage.getItem('userId') ? 'me' : 'other',
                    timestamp: new Date(msg.createdAt)
                })));

                // Initialize socket connection
                const newSocket = io(BACKEND_API, {
                    withCredentials: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    auth: {
                        token: localStorage.getItem('token')
                    }
                });

                newSocket.on('connect', () => {
                    newSocket.emit('register-user', localStorage.getItem('userId'));
                });

                newSocket.on('disconnect', () => {
                    enqueueSnackbar('Disconnected from chat', { variant: 'warning' });
                });

                newSocket.on('connect_error', (err) => {
                    if (err.message.includes("Authentication")) {
                        enqueueSnackbar('Authentication failed. Please login again.', { variant: 'error' });
                        navigate('/login');
                    }
                });

                newSocket.on('receive-message', (data) => {
                    setMessages(prev => [...prev, {
                        ...data,
                        sender: 'other',
                        timestamp: new Date()
                    }]);
                });

                newSocket.on('user-typing', (userId) => {
                    if (userId === receiverId) {
                        setIsTyping(true);
                        clearTimeout(typingTimeout);
                        setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
                    }
                });

                setSocket(newSocket);
            } catch (error) {
                if (error.response?.status === 401) {
                    enqueueSnackbar('Session expired. Please login again.', { variant: 'error' });
                    navigate('/login');
                } else {
                    enqueueSnackbar('Failed to load chat', { variant: 'error' });
                }
            } finally {
                setIsLoading(false);
            }
        };

        initChat();

        return () => {
            if (socket) {
                socket.disconnect();
            }
            clearTimeout(typingTimeout);
        };
    }, [receiverId]);

    // Send message with token verification
    const sendMessage = async () => {
        if (!input.trim() || !socket) return;

        try {
            // Verify token before sending
            const isVerified = await verifyToken();
            if (!isVerified) return;

            const message = {
                from: localStorage.getItem('userId'),
                to: receiverId,
                text: input.trim(),
                timestamp: new Date()
            };

            socket.emit('send-message', message, (response) => {
                if (response?.error) {
                    enqueueSnackbar('Failed to send message', { variant: 'error' });
                } else {
                    setMessages(prev => [...prev, { ...message, sender: 'me' }]);
                    setInput('');
                }
            });
        } catch (error) {
            enqueueSnackbar('Error sending message', { variant: 'error' });
        }
    };

    // Typing indicators with token check
    const handleInputChange = async (e) => {
        setInput(e.target.value);
        if (!socket) return;

        try {
            // const isVerified = await verifyToken();
            // if (!isVerified) return;

            if (e.target.value.length === 1) {
                socket.emit('typing', receiverId);
            } else if (e.target.value.length === 0) {
                socket.emit('stop-typing', receiverId);
            }
        } catch (error) {
            console.error('Typing indicator error:', error);
        }
    };



    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format time as HH:MM
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return (
        <div className="max-w-2xl mx-auto p-4 min-h-5 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white rounded-t-lg p-4 shadow-sm flex items-center border-b">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-2 p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {receiverName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                    <h2 className="text-lg font-semibold">{receiverName}</h2>
                    <p className="text-xs text-gray-500">
                        {isTyping ? 'typing...' : 'online'}
                    </p>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}>
                                <div className={`px-4 py-2 rounded-lg ${msg.sender === 'me'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <div className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'} text-gray-500`}>
                                    {formatTime(msg.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-b-lg p-4 shadow-sm">
                {isTyping && (
                    <div className="text-xs text-gray-500 mb-2">
                        {receiverName} is typing...
                    </div>
                )}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="w-full border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={() => {
                                if (input.trim()) sendMessage();
                                else inputRef.current.focus();
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${input.trim() ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;