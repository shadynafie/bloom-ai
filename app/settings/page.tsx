'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Key,
  User,
  CreditCard,
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface UserSettings {
  user: {
    id: string;
    name: string;
    email: string;
    credits: number;
    creditsUsed: number;
    resetDate: string;
  };
  apiKeys: {
    openai: string | null;
    anthropic: string | null;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [copiedOpenAI, setCopiedOpenAI] = useState(false);
  const [copiedAnthropic, setCopiedAnthropic] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setName(data.user.name || '');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => prev ? { ...prev, user: data.user } : null);
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, type: 'openai' | 'anthropic') => {
    navigator.clipboard.writeText(text);
    if (type === 'openai') {
      setCopiedOpenAI(true);
      setTimeout(() => setCopiedOpenAI(false), 2000);
    } else {
      setCopiedAnthropic(true);
      setTimeout(() => setCopiedAnthropic(false), 2000);
    }
  };

  const remainingCredits = settings ? settings.user.credits - settings.user.creditsUsed : 0;
  const creditsPercentage = settings ? ((remainingCredits / settings.user.credits) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={settings?.user.email || ''}
                  disabled
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <CardTitle>AI Credits</CardTitle>
              </div>
              <CardDescription>
                Track your AI usage and credits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold">{settings?.user.credits}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Used</p>
                  <p className="text-2xl font-bold">{settings?.user.creditsUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-primary">{remainingCredits}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Usage</span>
                  <span>{creditsPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Credits reset on: {new Date(settings?.user.resetDate || '').toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <CardTitle>API Keys</CardTitle>
              </div>
              <CardDescription>
                View and manage your AI API keys (configured in environment variables)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OpenAI API Key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>OpenAI API Key</Label>
                  {settings?.apiKeys.openai ? (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                      Connected
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">
                      Not Configured
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showOpenAI ? 'text' : 'password'}
                      value={settings?.apiKeys.openai || 'Not configured'}
                      disabled
                      className="pr-20"
                    />
                    {settings?.apiKeys.openai && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowOpenAI(!showOpenAI)}
                          className="h-7 w-7 p-0"
                        >
                          {showOpenAI ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(settings.apiKeys.openai!, 'openai')}
                          className="h-7 w-7 p-0"
                        >
                          {copiedOpenAI ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Set in: .env → OPENAI_API_KEY
                </p>
              </div>

              {/* Anthropic API Key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Anthropic API Key (Optional)</Label>
                  {settings?.apiKeys.anthropic ? (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                      Connected
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showAnthropic ? 'text' : 'password'}
                      value={settings?.apiKeys.anthropic || 'Not configured'}
                      disabled
                      className="pr-20"
                    />
                    {settings?.apiKeys.anthropic && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAnthropic(!showAnthropic)}
                          className="h-7 w-7 p-0"
                        >
                          {showAnthropic ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(settings.apiKeys.anthropic!, 'anthropic')}
                          className="h-7 w-7 p-0"
                        >
                          {copiedAnthropic ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Set in: .env → ANTHROPIC_API_KEY
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> API keys are stored in your .env file for security.
                  To update them, edit the .env file and restart the application.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Supported AI Models:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• OpenAI GPT-4 (Premium)</li>
                  <li>• OpenAI GPT-3.5 Turbo (Standard)</li>
                  <li>• Anthropic Claude 3 Opus (Optional)</li>
                  <li>• Anthropic Claude 3 Sonnet (Optional)</li>
                  <li>• Anthropic Claude 3 Haiku (Optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
