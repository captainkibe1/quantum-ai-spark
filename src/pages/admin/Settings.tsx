
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';
import { useChat } from '@/context/chat-context';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Settings = () => {
  const { apiKey, setApiKey } = useChat();
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [savingApiKey, setSavingApiKey] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'QuantumAI',
    defaultModel: 'gpt-4o-mini',
    maxTokens: 4000,
    temperature: 0.7,
    enableImageGeneration: true,
    enableAudioGeneration: false
  });
  
  const { toast } = useToast();

  const handleSaveApiKey = async () => {
    setSavingApiKey(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApiKey(newApiKey);
    toast({
      title: "API Key Updated",
      description: "Your OpenAI API key has been successfully saved.",
    });
    
    setSavingApiKey(false);
  };

  const handleSaveGeneralSettings = async () => {
    setSavingGeneral(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would actually save settings to backend/localStorage
    toast({
      title: "Settings Saved",
      description: "Your application settings have been updated.",
    });
    
    setSavingGeneral(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and API keys.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Customize your application's behavior and appearance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  value={generalSettings.appName}
                  onChange={(e) => setGeneralSettings({...generalSettings, appName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Default AI Model</Label>
                <Select
                  value={generalSettings.defaultModel}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, defaultModel: value})}
                >
                  <SelectTrigger id="defaultModel">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Text Models</SelectLabel>
                      <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={generalSettings.temperature}
                    onChange={(e) => setGeneralSettings({...generalSettings, temperature: parseFloat(e.target.value)})}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    {generalSettings.temperature < 0.5 ? 'More deterministic' : 
                     generalSettings.temperature > 1 ? 'More creative' : 
                     'Balanced'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableImageGeneration">Enable Image Generation</Label>
                <Switch
                  id="enableImageGeneration"
                  checked={generalSettings.enableImageGeneration}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableImageGeneration: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableAudioGeneration">Enable Audio Generation</Label>
                <Switch
                  id="enableAudioGeneration"
                  checked={generalSettings.enableAudioGeneration}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableAudioGeneration: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveGeneralSettings}
                disabled={savingGeneral}
              >
                {savingGeneral ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI API Key</CardTitle>
              <CardDescription>
                Enter your OpenAI API key to use with the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored securely and used to make requests to OpenAI's API.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveApiKey}
                disabled={savingApiKey}
              >
                {savingApiKey ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save API Key
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Settings</CardTitle>
              <CardDescription>
                Configure the available AI models and their parameters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">GPT-4o mini</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Enable</span>
                    <Switch defaultChecked id="enable-gpt4o-mini" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens-gpt4o-mini" className="text-sm">Maximum Tokens</Label>
                    <Input id="maxTokens-gpt4o-mini" type="number" defaultValue="4000" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">GPT-4o</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Enable</span>
                    <Switch defaultChecked id="enable-gpt4o" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens-gpt4o" className="text-sm">Maximum Tokens</Label>
                    <Input id="maxTokens-gpt4o" type="number" defaultValue="8000" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">GPT-4.5 Preview</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Enable</span>
                    <Switch defaultChecked id="enable-gpt45" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens-gpt45" className="text-sm">Maximum Tokens</Label>
                    <Input id="maxTokens-gpt45" type="number" defaultValue="32000" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">DALL-E 3</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Enable</span>
                    <Switch defaultChecked id="enable-dalle" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolution-dalle" className="text-sm">Default Resolution</Label>
                    <Select defaultValue="1024x1024">
                      <SelectTrigger id="resolution-dalle">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="1024x1792">1024x1792</SelectItem>
                        <SelectItem value="1792x1024">1792x1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Model Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced application settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <Switch id="debug-mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="strict-mode">Strict Content Filtering</Label>
                <Switch id="strict-mode" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="caching">Response Caching</Label>
                <Switch id="caching" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="logging">Usage Logging</Label>
                <Switch id="logging" defaultChecked />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Reset All Settings
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This will reset all application settings to their default values.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive">
                      Clear All User Data
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This will permanently delete all user data and conversations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
