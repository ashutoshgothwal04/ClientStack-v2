import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust if backend runs on different port

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const triggerInngestEvent = async (eventName, data) => {
    try {
        // Note: In a real app, you might hit your own backend endpoint which then sends the event to Inngest
        // or use the Inngest client directly if running in a node environment (Next.js server actions).
        // optimizing for the setup, we'll hit a debug endpoint on our server to trigger it manually
        // or we can just rely on the fact that Inngest functions are triggered by events sent to Inngest API.

        // For this demo, let's assume we have a backend endpoint that triggers the event
        // OR we can send it directly to Inngest Dev Server if running locally?
        // A better pattern for this specific setup:
        // 1. Frontend calls Backend /api/trigger-email
        // 2. Backend sends event to Inngest

        // Let's implement a generic trigger endpoint in the backend for testing purposes
        const response = await api.post('/api/test/trigger', {
            name: eventName,
            data: data
        });
        return response.data;
    } catch (error) {
        console.error('Error triggering event:', error);
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return 'Backend not available';
    }
}
