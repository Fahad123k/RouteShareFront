
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
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!socket) return;

        const onReceiveMessage = (message) => {
            setMessages(prev => [...prev, {
                ...message,
                sender: message.senderId._id === userId ? 'me' : 'other',
                timestamp: new Date(message.createdAt)
            }]);
            scrollToBottom();
        };

        const onUserTyping = ({ senderId }) => {
            if (senderId === receiverId) {
                setIsTyping(true);
                clearTimeout(typingTimeout);
                setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
            }
        };

        socket.on('receive-message', onReceiveMessage);
        socket.on('user-typing', onUserTyping);

        return () => {
            socket.off('receive-message', onReceiveMessage);
            socket.off('user-typing', onUserTyping);
        };
    }, [socket, receiverId, userId]);


    // Verify token function
    const verifyToken = async () => {
        // try {
        //     const response = await axios.get(`${BACKEND_API}/auth/verify-token`, {
        //         headers: { Authorization: `Bearer ${token}` }
        //     });
        //     return response.data.valid;
        // } catch (error) {
        //     enqueueSnackbar('Session expired. Please login again.', { variant: 'error' });
        //     navigate('/login');
        //     return false;
        // }
        return true;
    };

    useEffect(() => {
        if (!token) {
            enqueueSnackbar('Please login to continue', { variant: 'error' });
            navigate('/login');
            return;
        }

        // Replace your initChat function with this:
        const initChat = async () => {
            if (!token) {
                enqueueSnackbar('Please login to continue', { variant: 'error' });
                navigate('/login');
                return;
            }

            setIsLoading(true);

            try {
                // 1. Fetch receiver details
                const [userRes, chatRes] = await Promise.all([
                    axios.get(`${BACKEND_API}/user/${receiverId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${BACKEND_API}/user/messages`, {
                        params: { receiverId },
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setReceiverName(userRes.data.name || 'User');
                setMessages(chatRes.data.map(msg => ({
                    ...msg,
                    sender: msg.senderId === userId ? 'me' : 'other',
                    timestamp: new Date(msg.createdAt)
                })));

                // Initialize socket only once
                if (!socket) {
                    const newSocket = io(BACKEND_API, {
                        auth: { token },
                        transports: ['websocket'],
                        reconnection: true,
                        reconnectionAttempts: 5,
                        reconnectionDelay: 1000
                    });

                    newSocket.on('connect', () => {
                        setIsConnected(true);
                        console.log('Socket connected:', newSocket.id);
                        newSocket.emit('join-chat', { userId, receiverId });
                        setSocket(newSocket);
                    });

                    newSocket.on('disconnect', () => {
                        setIsConnected(false);
                        console.log('Socket disconnected');
                    });

                    newSocket.on('connect_error', (err) => {
                        console.error('Connection error:', err);
                        enqueueSnackbar('Connection error. Trying to reconnect...', { variant: 'error' });
                    });

                    newSocket.on('new-message', (message) => {
                        console.log('Received message:', message);
                        setMessages(prev => [...prev, {
                            ...message,
                            sender: message.senderId === userId ? 'me' : 'other',
                            timestamp: new Date(message.createdAt || Date.now())
                        }]);
                        scrollToBottom();
                    });
                }
            } catch (error) {
                console.error('Chat initialization error:', error);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        const messageText = input.trim();
        if (!messageText || !socket) return;

        try {
            // Create temporary message for optimistic update
            const tempId = Date.now();
            const tempMessage = {
                _id: tempId,
                text: messageText,
                senderId: userId,
                receiverId,
                createdAt: new Date(),
                isOptimistic: true
            };

            // Optimistic update
            setMessages(prev => [...prev, {
                ...tempMessage,
                sender: 'me',
                timestamp: new Date()
            }]);
            setInput('');
            scrollToBottom();

            // Send via socket
            socket.emit('send-message', {
                senderId: userId,
                receiverId,
                text: messageText
            }, (response) => {
                if (response.success) {
                    // Replace optimistic message with real one
                    setMessages(prev => prev.map(msg =>
                        msg._id === tempId ? {
                            ...response.message,
                            sender: 'me',
                            timestamp: new Date(response.message.createdAt)
                        } : msg
                    ));
                } else {
                    // Remove optimistic message if failed
                    setMessages(prev => prev.filter(msg => msg._id !== tempId));
                    enqueueSnackbar('Failed to send message', { variant: 'error' });
                }
            });

            // Stop typing indicator
            socket.emit('typing', { receiverId, senderId: userId, isTyping: false });
        } catch (error) {
            enqueueSnackbar('Error sending message', { variant: 'error' });
        }
    };


    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!socket) return;

        // Send typing indicator
        const isCurrentlyTyping = e.target.value.length > 0;
        socket.emit('typing-indicator', {
            receiverId,
            isTyping: isCurrentlyTyping
        });
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
            {/* <div className="ml-3">
                <h2 className="text-lg font-semibold">{receiverName}</h2>
                <p className="text-xs text-gray-500">
                    {isTyping ? 'typing...' : isConnected ? 'online' : 'connecting...'}
                </p>
            </div> */}
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
                        {/* {isTyping ? 'typing...' : 'online'} */}
                        <p className="text-xs text-gray-500">
                            {isTyping ? 'typing...' : isConnected ? 'online' : 'connecting...'}
                        </p>
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