import React, { useState } from 'react';
import { api, triggerInngestEvent, checkHealth } from '../utils/api';
import { toast } from 'sonner';

const TestBackend = () => {
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [loading, setLoading] = useState(false);

    const handleCheckHealth = async () => {
        const status = await checkHealth();
        setHealthStatus(status);
        toast.success(`Backend Status: ${status}`);
    };

    const handleTriggerEmail = async () => {
        setLoading(true);
        try {
            await triggerInngestEvent('user.signup', {
                email: 'test@example.com',
                firstName: 'Test User',
            });
            toast.success('Signup event triggered! Check server logs.');
        } catch (error) {
            toast.error('Failed to trigger event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Backend Integration Test</h1>

            <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4">Server Status</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCheckHealth}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Check Connection
                    </button>
                    <span className="text-muted-foreground">{healthStatus}</span>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Inngest Tests</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Send Welcome Email</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Triggers 'user.signup' event which runs the sendWelcomeEmail function.
                        </p>
                        <button
                            onClick={handleTriggerEmail}
                            disabled={loading}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Trigger Signup Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestBackend;
